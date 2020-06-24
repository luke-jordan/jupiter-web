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

    return body;
};

// for required save
const getAddCashCondition = (data) => {
    const addCashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
    const addCashCondition = `save_event_greater_than #{${addCashThreshold}}`;
    return addCashCondition;
}

const assembleStatusConditions = (data, isEventTriggered) => {
    const statusConditions = {};

    const initialStatus = isEventTriggered ? 'UNCREATED' : data.initialStatus;

    if (isEventTriggered) {
        statusConditions[data.initialStatus] = [`event_occurs #{${data.offerEvent}}`];
    }
      
    if (data.type === 'SIMPLE') {
        const cashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
        const cashCondition = data.category === 'ROUND_UP' ? 'balance_crossed_major_digit' : 'save_event_greater_than';
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
    const triggerParameters = isEventTriggered ? { triggerEvent: [data.offerEvent] } : {}; 
    
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
        if (data.category !== 'ROUND_UP') {
            actionContext.addCashPreFilled = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
        } else {
            actionContext.addCashTargetMinimum = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
            actionContext.addCashDigitThresholds = [3, 5, 10]; // in future may make a parameter
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

    return messagesToCreate;
}

export { 
    assembleRequestBasics,
    assembleStatusConditions,
    assembleBoostMessages,
};
