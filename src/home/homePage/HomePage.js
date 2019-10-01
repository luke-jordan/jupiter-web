import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import UserSearch from '../userSearch/UserSearch';
import './HomePage.scss';

class HomePage extends React.Component {
  render() {
    return <div className="home-page">
      <UserCounters/>
      <UserSearch/>
    </div>;
  }
}

export default HomePage;