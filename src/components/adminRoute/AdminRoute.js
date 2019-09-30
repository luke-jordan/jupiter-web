import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { currentUser } from 'helpers/currentUser';

const AdminRoute = ({ component: Component, ...rest }) => {
  return <Route {...rest} render={props => {
    const isLoginPath = /^\/login/.test(props.location.pathname);

    if (isLoginPath && currentUser.user) {
      // redirect to home page if user already logged in
      return <Redirect to="/"/>;
    }

    if (!isLoginPath && !currentUser.user) {
      // redirect to login page if user is not logged yet
      return <Redirect to="/login"/>;
    }

    return <Component {...props}/>;
  }}/>;
}

export default AdminRoute;
