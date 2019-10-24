import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

import { convertAmount, formatMoney } from 'src/core/utils';

export class UsersService {
  userStatuses = {
    USER_HAS_SAVED: 'User has saved'
  };

  kycStatuses = {
    NO_INFO: 'No information'
  };

  historyEventTypes = {
    USER_LOGIN: 'User logged in',
    SAVING_PAYMENT_SUCCESSFUL: 'Saving payment successful',
    WITHDRAWAL_EVENT_CONFIRMED: 'Withdrawal confirmed',
    WITHDRAWAL_COMPLETED: 'Withdrawal completed',
    PASSWORD_SET: 'Password changed',
    USER_REGISTERED: 'Profile created',
    STATUS_CHANGED: 'User status changed'
  };

  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getUsersCount(params) {
    return this.apiService.get(`${this.url}/user/count`, {
      sendToken: true, params
    }).pipe(
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

  searchUser(params) {
    if (params.nationalId) {
      params = Object.assign({}, params, { countryCode: 'ZAF' });
    }

    return this.apiService.get(`${this.url}/user/find`, {
      sendToken: true, params
    }).pipe(
      tap(user => this._modifyUser(user))
    );
  }

  getUserStatuesOptions

  getEventTypeOptions() {
    const options = Object.entries(this.historyEventTypes)
      .map(([value, text]) => ({ value, text }))
      .sort((a, b) => {
        if (a.text > b.text) {
          return 1;
        } else if (a.text < b.text) {
          return -1;
        } else {
          return 0;
        }
      });
    options.unshift({ text: 'All', value: 'ALL' });
    return options;
  }

  _modifyUser(user) {
    user.fullName = `${user.personalName} ${user.familyName}`;
    user.formattedStartDate = moment(user.creationTimeEpochMillis).format('MMM YYYY');

    const currentBalance = user.userBalance.currentBalance;
    currentBalance.amountValue = convertAmount(currentBalance.amount, currentBalance.unit);
    currentBalance.amountMoney = formatMoney(currentBalance.amountValue, currentBalance.currency);

    user.pendingTransactions.forEach(transaction => this._modifyUserTransaction(transaction));
    user.userHistory.userEvents.forEach(history => this._modifyUserHistory(history));
  }

  _modifyUserTransaction(transaction) {
    transaction.amountValue = convertAmount(transaction.amount, transaction.unit);
    transaction.amountMoney = formatMoney(transaction.amountValue, transaction.currency);
    transaction.formattedCreationDate = moment(transaction.creationTime).format('DD/MM/YYYY');
  }

  _modifyUserHistory(history) {
    history.eventTypeText = this.historyEventTypes[history.eventType] || history.eventType;
    history.formattedDate = moment(history.timestamp).format('DD/MM/YYYY HH:mm');
    history.date = new Date(history.timestamp);
  }
}