import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

import { convertAmount, formatMoney } from 'utils';

export class UsersService {
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
      tap(user => {
        this._modifyUser(user);
        user.pendingTransactions.forEach(transaction => this._modifyUserTransaction(transaction));
      })
    );
  }

  _modifyUser(user) {
    user.fullNameText = `${user.personalName} ${user.familyName}`;
    user.sinceDateText = `User since ${moment(user.creationTimeEpochMillis).format('MMM YYYY')}`;

    const currentBalance = user.userBalance.currentBalance;
    currentBalance.amountValue = convertAmount(currentBalance.amount, currentBalance.unit);
    currentBalance.amountMoney = formatMoney(currentBalance.amountValue, currentBalance.currency);
  }

  _modifyUserTransaction(transaction) {
    transaction.amountValue = convertAmount(transaction.amount, transaction.unit);
    transaction.amountMoney = formatMoney(transaction.amountValue, transaction.currency);
    transaction.creationTimeText = moment(transaction.creationTime).format('DD/MM/YYYY');
  }
}