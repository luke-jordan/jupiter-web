import React from 'react';

import UserCounters from '../userCounters/UserCounters';
import DataCounters from '../dataCounters/DataCounters';
import ClientsList from 'src/components/clientsList/ClientsList';
import UserSearch from 'src/components/userSearch/UserSearch';

import './HomePage.scss';

const HomePage = () => {
  return <div className="home-page">
    <div className="page-content">
      <UserCounters/>
      <UserSearch/>
      <DataCounters/>
      <div className="clients-header">Clients & Floats</div>
      <ClientsList/>
    </div>
  </div>;
}

export default HomePage;