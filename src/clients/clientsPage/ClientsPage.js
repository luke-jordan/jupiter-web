import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';
import ClientsListPage from '../clientsListPage/ClientsListPage';
import ClientFloatPage from '../clientFloatPage/ClientFloatPage';
import FloatAlertsPage from '../floatAlertsPage/FloatAlertsPage';

import './ClientsPage.scss';

const ClientsPage = () => {
  return <div className="clients-page">
    <Switch>
      <Route path="/clients" exact component={ClientsListPage}/>
      <Route path="/clients/:clientId/float/:floatId" exact component={ClientFloatPage}/>
      <Route path="/clients/:clientId/float/:floatId/alerts" exact component={FloatAlertsPage}/>
      <Route render={() => <Redirect to="/clients"/>}/>
    </Switch>
  </div>;
};

export default errorBoundary(ClientsPage);