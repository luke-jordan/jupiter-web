import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';

import { setAmountValueAndMoney, formatAmountString } from 'src/core/utils';
import { userHistoryEventTypeMap, userTransactionTypeMap } from 'src/core/constants';

export class UsersService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getUsersCount(params) {
    return this.apiService.get(`${this.url}/user/count`, { params }).pipe(
      map(res => +res.userCount)
    );
  }

  getDailyWeeklyUsersCount(date) {
    const startDate = moment(date).startOf('day');
    const endDate = moment(date).endOf('day');

    const daily = this.getUsersCount({
      startTimeMillis: +startDate,
      endTimeMillis: +endDate
    });

    const weekly = this.getUsersCount({
      startTimeMillis: +moment(startDate).subtract(1, 'week'),
      endTimeMillis: +endDate
    });

    return forkJoin(daily, weekly).pipe(
      map(([dailyCount, weeklyCount]) => {
        return { dailyCount, weeklyCount }
      })
    );
  }

  // todo : almost certainly a better way to do this but not worth trade-off at present
  getAccountsList() {
    const params = { type: 'list' };
    return this.apiService.get(`${this.url}/user/find`, { params }).pipe(
      map(res => res.map((account) => this._modifyUserAccountSummary(account)))
    );
  }

  searchUser(params) {
    params = Object.assign({}, params, { countryCode: 'ZAF' });

    return this.apiService.get(`${this.url}/user/find`, { params }).pipe(
      map(result => this._modifySearchResult(result))
    );
  }

  updateUser(data) {
    return this.apiService.post(`${this.url}/user/update`, data);
  }

  uploadFile(data) {
    return this.apiService.post(`${this.url}/user/document/store`, data);
  }

  fetchFile(params) {
    return this.apiService.get(`${this.url}/user/document/retrieve`, { params });
  }

  _modifySearchResult(result) {
    if (!result) {
      return { length: 0 };
    } else if (Array.isArray(result)) {
      return { length: result.length, possibleUsers: result.map((user) => this._modifyUserAccountSummary(user)) };
    } else {
      return { length: 1, user: this._modifyUser(result) };
    }
  }

  _modifyUser(user) {
    const calledNamePart = user.calledName ? ` (${user.calledName}) ` : ' ';
    user.fullName = `${user.personalName}${calledNamePart}${user.familyName}`;
    user.formattedStartDate = moment(user.creationTimeEpochMillis).format('MMM YYYY');

    const currentBalance = user.userBalance.currentBalance;
    setAmountValueAndMoney(currentBalance, 'amount', currentBalance.unit, currentBalance.currency);

    user.pendingTransactions.forEach(transaction => this._modifyUserTransaction(transaction));
    user.userHistory.userEvents.forEach(history => this._modifyUserHistory(history));
    return user;
  }

  _modifyUserTransaction(transaction) {
    setAmountValueAndMoney(transaction, 'amount', transaction.unit, transaction.currency);
    transaction.formattedCreationDate = moment(transaction.creationTime).format('DD/MM/YYYY');
    transaction.transactionTypeText = userTransactionTypeMap[transaction.transactionType] || transaction.transactionType;
  }

  _modifyUserKycResult(context) {
    const apiResponse = context ? context.apiResponse : null;
    if (!apiResponse) {
      return 'Unknown server error or log not available';
    }

    if (apiResponse.message) {
      return apiResponse.message;
    }

    return Object.keys(apiResponse).map((key) => `${key}: ${apiResponse[key]}`).join(', ');
  }
  
  _modifyUserHistory(history) {
    const { eventType, context } = history;
    let eventTypeText = userHistoryEventTypeMap[history.eventType] || history.eventType;
    const hasAmountInfo = (keyPrefix) => (
      context && context[`${keyPrefix}Amount`] && typeof context[`${keyPrefix}Amount`] === 'string' && context[`${keyPrefix}Amount`].length > 0
    );

    if (eventType === 'SAVING_PAYMENT_SUCCESSFUL' && hasAmountInfo('saved')) {
      const { savedAmount } = context;
      eventTypeText = `${eventTypeText} (${formatAmountString(savedAmount)})`;
    } else if (eventType === 'WITHDRAWAL_EVENT_CONFIRMED' && hasAmountInfo('withdrawal')) {
      const { withdrawalAmount } = context;
      eventTypeText = `${eventTypeText} (${formatAmountString(withdrawalAmount)})`;
    } else if (eventType === 'BOOST_REDEEMED' && hasAmountInfo('boost')) {
      const { boostAmount } = context;
      eventTypeText = `${eventTypeText} (${formatAmountString(boostAmount)})`;
    } else if (eventType === 'VERIFIED_AS_PERSON' || eventType === 'FAILED_VERIFICATION') {
      const eventSuffix = `KYC checker logs: ${this._modifyUserKycResult(context)}`;
      eventTypeText = `${eventTypeText}. ${eventSuffix}`;
    } else if (eventType === 'BANK_VERIFICATION_FAILED') {
      const { resultFromVerifier } = context;
      const failureCause = resultFromVerifier ? resultFromVerifier.cause : 'unknown cause, consult logs';
      eventTypeText = `${eventTypeText} (${failureCause})`;
    } else if (eventType === 'ADMIN_STORED_DOCUMENT') {
      const { logDescription } = context;
      eventTypeText = `${eventTypeText}, with description: ${logDescription}`;
    } else if (eventType === 'USER_PROFILE_UPDATED') {
      eventTypeText = `${eventTypeText}, fields changed: ${JSON.stringify(context)}`;
    } else if (eventType === 'USER_STATUS_UPDATED') {
      eventTypeText = `${eventTypeText}, details: ${JSON.stringify(context.reasons)}`;
    }
    
    history.eventTypeText = eventTypeText;
    history.formattedDate = moment(history.timestamp).format('DD/MM/YYYY HH:mm');
    history.date = new Date(history.timestamp);
  }

  _modifyUserAccountSummary(account) {
    account.formattedCreationTime = moment(account.creationTime).format('DD/MM/YYYY HH:mm');
    account.saveCount = account.count;
    return account;
  }
}