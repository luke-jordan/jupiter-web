import React from 'react';
import { Router, Switch } from 'react-router-dom';

import PageLayout from 'components/pageLayout/PageLayout';
import AdminRoute from 'components/adminRoute/AdminRoute';
import LoginPage from 'login/loginPage/LoginPage';
import { historyService } from 'services';

const HomePage = () => 'Home page';
const UsersPage = () => 'Users page';
const BoostsPage = () => 'Boosts page';
const MessagesPage = () => 'Messages page';
const ClientsAndFloatsPage = () => 'Clients and floats page';
const NotFoundPage = () => 'Page not exit'

class Root extends React.Component {
  render() {
    return <Router history={historyService}>
      <PageLayout>
        <Switch>
          <AdminRoute path="/" exact component={HomePage}/>
          <AdminRoute path="/login" component={LoginPage}/>
          <AdminRoute path="/users" component={UsersPage}/>
          <AdminRoute path="/boosts" component={BoostsPage}/>
          <AdminRoute path="/messages" component={MessagesPage}/>
          <AdminRoute path="/clients-and-floats" component={ClientsAndFloatsPage}/>
          <AdminRoute component={NotFoundPage}/>
        </Switch>
      </PageLayout>
    </Router>;
  }
}

export default Root;