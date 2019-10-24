import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import DataCounters from '../dataCounters/DataCounters';
import ClientsList from '../clientsList/ClientsList';
import UserSearch from 'src/components/userSearch/UserSearch';

import './HomePage.scss';

const HomePage = () => {
  return <div className="home-page">
    <div className="page-content">
      <UserCounters/>
      <UserSearch/>
      <DataCounters/>
      <ClientsList/>
    </div>
  </div>;
}

export default HomePage;