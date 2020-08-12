import moment from 'moment';

const assembleMlParams = (data) => {
    const mlParameters = {
        onlyOfferOnce: data.mlOfferMoreThanOnce === 'FALSE'
    };

    if (mlParameters.onlyOfferOnce) {
        mlParameters.minIntervalBetweenRuns = { value: data.mlMinDaysBetweenOffer, unit: 'days' }
    }

    if (data.mlSetMaxUsersPerRun === 'TRUE') {
        mlParameters.maxUsersPerOfferRun = { basis: 'ABSOLUTE', value: data.mlMaxUsersPerOfferRun };
    }

    return mlParameters;
}

const assembleRequestBasics = (data) => {
    const body = {};
    const flags = [];

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

    // then some flag setting and other options for more 'advanced' boosts
    if (data.offeredCondition === 'EVENT') {
        flags.push('EVENT_DRIVEN');   
        body.boostAudienceType = 'EVENT_DRIVEN';
    }

    // some important withdrawal stuff
    if (data.type === 'WITHDRAWAL') {
        flags.push(['WITHDRAWAL_HALTING']);
        body.boostAudienceType = 'EVENT_DRIVEN';
    }

    // and similarly, setting up ML parameters if this is an ML boost
    if (data.offeredCondition === 'ML_DETERMINED') {
        body.boostAudienceType = 'ML_DETERMINED';
        body.mlParameters = assembleMlParams(data);
    }

    // ML and recurring boosts require this (as boost could last a while but each offer to user is short)
    if (['ML_DETERMINED', 'AUDIENCE_REFRESH'].includes(data.offeredCondition)) {
        flags.push(data.offeredCondition);
        body.expiryParameters = {
            individualizedExpiry: true,
            timeUntilExpiry: { unit: 'hours', value: data.expiryHours}
        }
    }

    // ML and recurring boosts require this (as boost could last a while but each offer to user is short)
    if (['ML_DETERMINED', 'AUDIENCE_REFRESH'].includes(data.offeredCondition)) {
        body.expiryParameters = {
            individualizedExpiry: true,
            timeUntilExpiry: { unit: 'hours', value: data.expiryHours}
        }
    }

    // and if it is a random amount boost
    if (data.isRandomAmount) {
        flags.push('RANDOM_AMOUNT');

        const minReward = { 
            amount: data.randomMinimum,
            unit: 'WHOLE_CURRENCY',
            currency: data.currency
        };

        body.rewardParameters = {
            rewardType: 'RANDOM',
            distribution: 'UNIFORM',
            minRewardAmountPerUser: minReward,
        }
    }

    if (data.hasConsolationPrize) {
        const consolationPrize = {
            type: data.consolationType,
            amount: { amount: parseInt(data.consolationAmount) * 100, unit: 'WHOLE_CENT', currency: 'ZAR' }
        }

        body.rewardParameters = body.rewardParameters ? { ...body.rewardParameters, consolationPrize } : { consolationPrize };
    }

    if (data.isRandomSelection) {
        flags.push('RANDOM_SELECTION');
    }

    if (data.allowRepeatPlay) {
        flags.push('ALLOW_REPEAT_PLAY');   
    }

    if (flags.length > 0) {
        body.flags = flags;
    }

    return body;
};

const mapAddCashTypeToCondition = (category) => {
    // console.log('Category: ', category);
    switch (category) {
        case 'ROUND_UP':
            return 'balance_crossed_major_digit';
        case 'TARGET_BALANCE':
            return 'balance_crossed_abs_target';
        default:
            return 'save_event_greater_than';
    }
};

// for required save
const getAddCashCondition = (data) => {
    const { typeOfSaveUnlock } = data;
    // console.log('Type of save unlock: ', typeOfSaveUnlock);

    const addCashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
    const addCashCondition = `${mapAddCashTypeToCondition(typeOfSaveUnlock)} #{${addCashThreshold}}`;
    
    return addCashCondition;
};

const assembleStatusConditions = (data, isEventTriggered, isMlDetermined = false) => {
    const statusConditions = {};

    // this was not a good idea, but little time now to chase down effects of changing, so grandfather in better 
    // route (using audience presentation type) via withdrawal then come back and fix
    let initialStatus = data.initialStatus;
    if (isEventTriggered) {
        initialStatus = 'UNCREATED';
        statusConditions[data.initialStatus] = [`event_occurs #{${data.offerEvent}}`];
    }

    if (isMlDetermined) {
        initialStatus = 'CREATED';
    }
    
    if (data.type === 'SIMPLE') {
        const cashThreshold = `${data.requiredSave}::WHOLE_CURRENCY::${data.currency}`;
        const cashCondition = mapAddCashTypeToCondition(data.category);

        if (data.isRandomSelection) {
            statusConditions.PENDING = [`${cashCondition} #{${cashThreshold}}`];
            statusConditions.REDEEMED = [`randomly_chosen_first_N #{${data.numberToSelect}}`];
        } else {
            statusConditions.REDEEMED = [`${cashCondition} #{${cashThreshold}}`];
        }
    }

    // game paramaters
    let gameParams = null;    
    if (data.type === 'GAME') {
        gameParams = {
            gameType: data.category,
            timeLimitSeconds: parseInt(data.timeLimitSeconds, 10),
            allowRepeatPlay: data.allowRepeatPlay,
        };

        if (data.initialStatus !== 'UNLOCKED') {
            gameParams.entryCondition = getAddCashCondition(data);
        }

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

        if (data.hasConsolationPrize) {
            gameParams.hasConsolationPrize = true;
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

const assembleBoostMessages = (data, isEventTriggered, isMlDetermined = false) => {
    const messagesToCreate = [];

    // general message params
    let actionToTake = 'ADD_CASH';
    if (data.type === 'SOCIAL') {
        actionToTake = 'VIEW_FRIENDS';
    } else if (data.type === 'WITHDRAWAL') {
        actionToTake = 'VIEW_HISTORY';
    } else if (data.initialStatus === 'UNLOCKED') {
        actionToTake = 'VIEW_BOOSTS';
    }
    
    let presentationType = 'ONCE_OFF';
    if (isEventTriggered) {
        presentationType = 'EVENT_DRIVEN';
    }
    if (isMlDetermined) {
        presentationType = 'ML_DETERMINED';
    }

    const offerEvent = data.type === 'WITHDRAWAL' ? 'WITHDRAWAL_BOOST_OFFERED' : data.offerEvent;
    const triggerParameters = isEventTriggered ? { triggerEvent: [offerEvent] } : {}; 
    
    // push notification
    if (data.pushBody) {
        messagesToCreate.push({
            boostStatus: 'OFFERED',
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
        const msgDisplay = { type: 'EMAIL' };

        if (typeof data.emailBackupSms === 'string' && data.emailBackupSms.trim().length > 0) {
            msgDisplay.backupSms = data.emailBackupSms;
        }

        const emailMsg = {
            boostStatus: 'OFFERED',
            presentationType,
            isMessageSequence: false,
            template: {
                display: msgDisplay,
                title: data.emailSubject,
                body: data.emailBody
            },
            triggerParameters
        };

        messagesToCreate.push(emailMsg);
    }

    return messagesToCreate;
}

export { 
    assembleRequestBasics,
    assembleStatusConditions,
    assembleBoostMessages,
};
