import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import UserSearch from '../userSearch/UserSearch';
import DataCounters from '../dataCounters/DataCounters';
import './HomePage.scss';

class HomePage extends React.Component {
  render() {
    return <div className="home-page">
      <UserCounters/>
      <UserSearch/>
      <DataCounters/>
    </div>;
  }
}

export default HomePage;