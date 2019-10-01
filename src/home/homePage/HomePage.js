import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import './HomePage.scss';

class HomePage extends React.Component {
  render() {
    return <div className="home-page">
      <UserCounters/>
    </div>;
  }
}

export default HomePage;