import moment from 'moment';

const assembleRequestBasics = (data) => {
    const body = {};

    // label
    body.label = data.label;

    // type & category
    body.boostTypeCategory = `${data.type}::${data.category}`;

    // client id
    body.forClientId = data.clientId;
    
    // amount per user, 
    body.boostAmountOffered = `${data.perUserAmount}::WHOLE_CURRENCY::${data.currency}`;

    // source
    body.boostSource = { bonusPoolId: data.source, clientId: data.clientId, floatId: 'zar_mmkt_float' };

    // total budget
    body.boostBudget = `${data.totalBudget}::WHOLE_CURRENCY::${data.currency}`;

    // expiry time
    body.endTimeMillis = data.endTime ? data.endTime.getTime() : +moment().endOf('day');

    // some important withdrawal stuff
    if (data.type === 'WITHDRAWAL') {
        body.flags = ['WITHDRAWAL_HALTING'];
        body.boostAudienceType = 'EVENT_DRIVEN';
    }

    return body;
};

// for required save
const getAddCashCondition = (data) => {
    const addCashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
    const addCashCondition = `save_event_greater_than #{${addCashThreshold}}`;
    return addCashCondition;
};

const mapSimpleCategoryToCashCondition = (data) => {
    switch (data.category) {
        case 'ROUND_UP':
            return 'balance_crossed_major_digit';
        case 'TARGET_BALANCE':
            return 'balance_crossed_abs_target';
        default:
            return 'save_event_greater_than';
    }
}

const assembleStatusConditions = (data, isEventTriggered) => {
    const statusConditions = {};

    // this was not a good idea, but little time now to chase down effects of changing, so grandfather in better 
    // route (using audience presentation type) via withdrawal then come back and fix
    let initialStatus = isEventTriggered ? 'UNCREATED' : data.initialStatus;

    if (isEventTriggered) {
        statusConditions[data.initialStatus] = [`event_occurs #{${data.offerEvent}}`];
    }
      
    if (data.type === 'SIMPLE') {
        const cashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
        const cashCondition = mapSimpleCategoryToCashCondition(data);
        statusConditions.REDEEMED = [`${cashCondition} #{${cashThreshold}}`];
    }

    // game paramaters
    let gameParams = null;    
    if (data.type === 'GAME') {
        gameParams = {
            gameType: data.category,
            entryCondition: getAddCashCondition(data),
            timeLimitSeconds: parseInt(data.timeLimitSeconds, 10),
        };

        if (data.category === 'CHASE_ARROW') {
            gameParams.arrowSpeedMultiplier = parseInt(data.arrowSpeedMultiplier, 10);
        }

        if (data.category === 'DESTROY_IMAGE') {
            gameParams.tapsPerSquare = parseInt(data.imageBlockTapsToDestroy, 10);
            gameParams.gameImage = data.breakingGameImage;
        }

        // todo : could make this more elegant tbh
        if (data.thresholdType === 'TOURNAMENT') {
            gameParams.numberWinners = parseInt(data.winningThreshold, 10);
        } else {
            gameParams.winningThreshold = parseInt(data.winningThreshold, 10);
        }
    }

    if (data.type === 'SOCIAL') {
        const isAdded = data.category === 'FRIENDS_ADDED';
        const conditionType = isAdded ? 'friends_added_since' : 'total_number_friends';
        const conditionSuffix = isAdded ? `${moment().valueOf()}` : data.initiatedRequirement;
        statusConditions.REDEEMED = [`${conditionType} #{${data.friendThreshold}::${conditionSuffix}}`];
    }

    if (data.type === 'WITHDRAWAL') {
        initialStatus = 'OFFERED'; // by definition

        const timeSuffix = `${data.withdrawalMinDays}::DAYS`;
        statusConditions['OFFERED'] = [`event_occurs #{${data.withdrawalEventAnchor}}`];
        statusConditions['PENDING'] = [`event_occurs #{WITHDRAWAL_EVENT_CANCELLED}`];
        statusConditions['REDEEMED'] = [`event_does_not_follow #{WITHDRAWAL_EVENT_CANCELLED::ADMIN_SETTLED_WITHDRAWAL::${timeSuffix}}`];
        statusConditions['EXPIRED'] = [`event_does_follow #{${data.withdrawalEventAnchor}::ADMIN_SETTLED_WITHDRAWAL::${timeSuffix}}`];   
        statusConditions['FAILED'] = [`event_does_follow #{WITHDRAWAL_EVENT_CANCELLED::ADMIN_SETTLED_WITHDRAWAL::${timeSuffix}}`];
    }

    return { statusConditions, initialStatus, gameParams };
};

const assembleBoostMessages = (data, isEventTriggered) => {
    const messagesToCreate = [];

    // general message params
    let actionToTake = 'ADD_CASH';
    if (data.type === 'SOCIAL') {
        actionToTake = 'VIEW_FRIENDS';
    } else if (data.initialStatus === 'UNLOCKED') {
        actionToTake = 'VIEW_BOOSTS';
    }
    
    const presentationType = isEventTriggered ? 'EVENT_DRIVEN' : 'ONCE_OFF';

    const offerEvent = data.type === 'WITHDRAWAL' ? 'WITHDRAWAL_BOOST_OFFERED' : data.offerEvent;
    const triggerParameters = isEventTriggered ? { triggerEvent: [offerEvent] } : {}; 
    
    // push notification
    if (data.pushBody) {
        messagesToCreate.push({
            boostStatus: 'CREATED',
            presentationType,
            actionToTake,
            isMessageSequence: false,
            template: {
                title: data.pushTitle, body: data.pushBody,
                display: { type: 'PUSH' }
            },
            triggerParameters
        });
    }

    // card
    if (data.cardBody) {
        const actionContext = {};
        if (data.category === 'ROUND_UP') {
            actionContext.addCashTargetMinimum = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
            actionContext.addCashDigitThresholds = [3, 5, 10]; // in future may make a parameter
        } else if (data.category === 'TARGET_BALANCE') {
            actionContext.addCashTargetMinimum = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
        } else {
            actionContext.addCashPreFilled = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;

        }        

        messagesToCreate.push({
            boostStatus: 'OFFERED',
            presentationType,
            actionToTake,
            isMessageSequence: false,
            template: {
                display: { type: 'CARD' }, 
                title: data.cardTitle, 
                body: data.cardBody,
                actionToTake,
                actionContext
            },
            triggerParameters
        });
    }

    // email
    if (data.emailBody) {
        messagesToCreate.push({
            boostStatus: 'OFFERED',
            presentationType,
            isMessageSequence: false,
            template: {
                display: { type: 'EMAIL' },
                title: data.emailSubject,
                body: data.emailBody
            },
            triggerParameters
        });
    }

    return messagesToCreate;
}

export { 
    assembleRequestBasics,
    assembleStatusConditions,
    assembleBoostMessages,
};
