import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';
import UserSearchPage from '../userSearchPage/UserSearchPage';
import UserHistoryPage from '../userHistoryPage/UserHistoryPage';

import './UsersPage.scss';

const UsersPage = props => {
  return <div className="users-page">
    <Switch>
      <Route path="/users" exact component={UserSearchPage}/>
      <Route path="/users/history" exact component={UserHistoryPage}/>
      <Route render={() => <Redirect to="/users"/>}/>
    </Switch>
  </div>;
};

export default errorBoundary(UsersPage);