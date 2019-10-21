import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import DataCounters from '../dataCounters/DataCounters';
import ClientsList from '../clientsList/ClientsList';
import UserSearch from 'components/userSearch/UserSearch';
import { inject } from 'utils';

import './HomePage.scss';

class HomePage extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');
  }

  render() {
    return <div className="home-page">
      <div className="page-content">
        <UserCounters/>
        <UserSearch onSearch={this.searchUser}/>
        <DataCounters/>
        <ClientsList/>
      </div>
    </div>;
  }

  searchUser = data => {
    this.historyService.push(`/users?${new URLSearchParams(data)}`);
  }
}

export default HomePage;