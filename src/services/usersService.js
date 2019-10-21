import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import moment from 'moment';

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
    });
  }
}