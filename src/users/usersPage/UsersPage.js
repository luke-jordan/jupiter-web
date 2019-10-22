import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import UserSearchResult from '../userSearchResult/UserSearchResult';

import './UsersPage.scss';

const UsersPage = props => {
  return <div className="users-page">
    <Switch>
      <Route path="/users" exact component={UserSearchResult}/>
      <Route path="/users/history" exact render={() => 'User history'}/>
      <Route render={() => <Redirect to="/users"/>}/>
    </Switch>
  </div>;
};

export default UsersPage;