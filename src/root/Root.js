import React from 'react';
import { HashRouter as Router, Switch } from 'react-router-dom';

import { inject } from 'src/core/utils';
import PageLayout from 'src/components/pageLayout/PageLayout';
import AdminRoute from 'src/components/adminRoute/AdminRoute';
import LoginPage from 'src/login/loginPage/LoginPage';
import HomePage from 'src/home/homePage/HomePage';
import MessagesPage from 'src/messages/messagesPage/MessagesPage';
import BoostsPage from 'src/boosts/boostsPage/BoostsPage';
import UsersPage from 'src/users/usersPage/UsersPage';
import ClientsPage from 'src/clients/clientsPage/ClientsPage';
import SnippetsPage from 'src/snippets/SnippetsPage';

const PageNotFound = () => <div className="no-data">Page not found</div>;

class Root extends React.Component {
  render() {
    return <Router history={inject('HistoryService')}>
      <PageLayout>
        <Switch>
          <AdminRoute path="/" exact component={HomePage}/>
          <AdminRoute path="/login" component={LoginPage}/>
          <AdminRoute path="/users" component={UsersPage}/>
          <AdminRoute path="/boosts" component={BoostsPage}/>
          <AdminRoute path="/messages" component={MessagesPage}/>
          <AdminRoute path="/clients" component={ClientsPage}/>
          <AdminRoute path="/snippets" component={SnippetsPage}/>
          <AdminRoute component={PageNotFound}/>
        </Switch>
      </PageLayout>
    </Router>;
  }
}

export default Root;