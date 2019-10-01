import React from 'react';
import moment from 'moment';

import { usersService } from 'services';
import './UserCounters.scss';

export class UserCounters extends React.Component {
  constructor() {
    super();
    this.state = {
      totalCount: 0,
      totalLoading: false,

      todayDailyCount: 0,
      todayWeeklyCount: 0,
      todayLoading: false,

      yesterdayDailyCount: 0,
      yesterdayWeeklyCount: 0,
      yesterdayLoading: false
    };

    this.todayDate = moment();
    this.yesterdayDate = moment().subtract('1', 'day');
  }

  componentDidMount() {
    this.setState({
      totalLoading: true,
      todayLoading: true,
      yesterdayLoading: true
    });

    usersService.getUsersCount().subscribe(totalCount => {
      this.setState({ totalCount, totalLoading: false });
    });

    usersService.getDailyWeeklyUsersCount(this.state.todayDate).subscribe(res => {
      this.setState({
        todayDailyCount: res.dailyCount,
        todayWeeklyCount: res.weeklyCount,
        todayLoading: false
      });
    });

    usersService.getDailyWeeklyUsersCount(this.state.todayDate).subscribe(res => {
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
          {state.totalLoading ? <div className="spinner"/> :
            <div className="total-users">
              <img alt="" src="images/user-circle.svg"/>
              <div className="total-count">{state.totalCount}</div>
              <div className="total-label">Total Users</div>
            </div>}
        </div>
      </div>

      {/* Today */}
      <div className="card gradient-widget">
        <div className="card-header">
          <div className="header-left">Today</div>
          <div className="header-right">{this.todayDate.format('DD MMM YYYY')}</div>
        </div>
        <div className="card-body">
          {state.todayLoading ? <div className="spinner"/> :
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
      <div className="card gradient-widget">
        <div className="card-header">
          <div className="header-left">Yesterday</div>
          <div className="header-right">{this.yesterdayDate.format('DD MMM YYYY')}</div>
        </div>
        <div className="card-body">
          {state.yesterdayLoading ? <div className="spinner"/> :
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

export default UserCounters;