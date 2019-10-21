import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import UserDetails from '../userDetails/UserDetails';

import './UsersPage.scss';

const UsersPage = props => {
  return <div className="users-page">
    <Switch>
      <Route path="/users/details" exact component={UserDetails}/>
      <Route path="/users/history/:id" exact render={() => 'User history'}/>
      <Route render={() => <Redirect to="/users"/>}/>
    </Switch>
  </div>;
};

export default UsersPage;