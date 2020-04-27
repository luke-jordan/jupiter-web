import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
      tap(user => this._modifyUser(user))
    );
  }

  updateUser(data) {
    return this.apiService.post(`${this.url}/user/update`, data);
  }

  _modifyUser(user) {
    const calledNamePart = user.calledName ? ` (${user.calledName}) ` : ' ';
    user.fullName = `${user.personalName}${calledNamePart}${user.familyName}`;
    user.formattedStartDate = moment(user.creationTimeEpochMillis).format('MMM YYYY');

    const currentBalance = user.userBalance.currentBalance;
    setAmountValueAndMoney(currentBalance, 'amount', currentBalance.unit, currentBalance.currency);

    user.pendingTransactions.forEach(transaction => this._modifyUserTransaction(transaction));
    user.userHistory.userEvents.forEach(history => this._modifyUserHistory(history));
  }

  _modifyUserTransaction(transaction) {
    setAmountValueAndMoney(transaction, 'amount', transaction.unit, transaction.currency);
    transaction.formattedCreationDate = moment(transaction.creationTime).format('DD/MM/YYYY');
    transaction.transactionTypeText = userTransactionTypeMap[transaction.transactionType] || transaction.transactionType;
  }

  
  _modifyUserHistory(history) {
    const { eventType, context } = history;
    let eventTypeText = userHistoryEventTypeMap[history.eventType] || history.eventType;
    const hasAmountInfo = context && context.savedAmount && typeof context.savedAmount === 'string' && context.savedAmount.length > 0;
    if (eventType === 'SAVING_PAYMENT_SUCCESSFUL' && hasAmountInfo) {
      const { savedAmount } = context;
      eventTypeText = `${eventTypeText} (${formatAmountString(savedAmount)})`;
    } else if (eventType === 'WITHDRAWAL_EVENT_CONFIRMED' && hasAmountInfo) {
      const { withdrawalAmount } = context;
      eventTypeText = `${eventTypeText} (${formatAmountString(withdrawalAmount)})`;
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