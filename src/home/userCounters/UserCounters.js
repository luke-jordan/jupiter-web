import React from 'react';
import moment from 'moment';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'utils';
import Spinner from 'components/spinner/Spinner';
import { errorBoundary } from 'components/errorBoundary/ErrorBoundary';

import './UserCounters.scss';
import userCirleImage from 'assets/images/user-circle.svg';

export class UserCounters extends React.Component {
  constructor() {
    super();
    this.usersService = inject('UsersService');

    this.state = {
      totalCount: 0,
      totalLoading: true,

      todayDailyCount: 0,
      todayWeeklyCount: 0,
      todayLoading: true,

      yesterdayDailyCount: 0,
      yesterdayWeeklyCount: 0,
      yesterdayLoading: true
    };

    this.todayDate = moment();
    this.yesterdayDate = moment().subtract('1', 'day');

    unmountDecorator(this);
  }

  componentDidMount() {
    this.usersService.getUsersCount().pipe(
      takeUntil(this.unmount$)
    ).subscribe(totalCount => {
      this.setState({ totalCount, totalLoading: false });
    });

    this.usersService.getDailyWeeklyUsersCount(this.state.todayDate).pipe(
      takeUntil(this.unmount$)
    ).subscribe(res => {
      this.setState({
        todayDailyCount: res.dailyCount,
        todayWeeklyCount: res.weeklyCount,
        todayLoading: false
      });
    });

    this.usersService.getDailyWeeklyUsersCount(this.state.todayDate).pipe(
      takeUntil(this.unmount$)
    ).subscribe(res => {
      this.setState({
        yesterdayDailyCount: res.dailyCount,
        yesterdayWeeklyCount: res.weeklyCount,
        yesterdayLoading: false
      });
    });
  }

  render() {
    const state = this.state;
    return <div className="user-counters">
      {/* Total */}
      <div className="card">
        <div className="card-body">
          {state.totalLoading ? <Spinner/> :
            <div className="total-users">
              <img alt="" src={userCirleImage}/>
              <div className="total-count">{state.totalCount}</div>
              <div className="total-label">Total Users</div>
            </div>}
        </div>
      </div>

      {/* Today */}
      <div className="card card-with-gradient">
        <div className="card-header">
          <div className="header-left">Today</div>
          <div className="header-right">{this.todayDate.format('DD MMM YYYY')}</div>
        </div>
        <div className="card-body">
          {state.todayLoading ? <Spinner/> :
            <ul className="counters-list">
              <li>
                <span className="counter-name">Daily Users</span>
                <span className="counter-value">{state.todayDailyCount}</span>
              </li>
              <li>
                <span className="counter-name">Weekly User</span>
                <span className="counter-value">{state.todayWeeklyCount}</span>
              </li>
            </ul>}
        </div>
      </div>
      
      {/* Yesterday */}
      <div className="card card-with-gradient">
        <div className="card-header">
          <div className="header-left">Yesterday</div>
          <div className="header-right">{this.yesterdayDate.format('DD MMM YYYY')}</div>
        </div>
        <div className="card-body">
          {state.yesterdayLoading ? <Spinner/> :
            <ul className="counters-list">
              <li>
                <span className="counter-name">Daily Users</span>
                <span className="counter-value">{state.yesterdayDailyCount}</span>
              </li>
              <li>
                <span className="counter-name">Weekly Users</span>
                <span className="counter-value">{state.yesterdayWeeklyCount}</span>
              </li>
            </ul>}
        </div>
      </div>
    </div>;
  }
}

export default errorBoundary(UserCounters);