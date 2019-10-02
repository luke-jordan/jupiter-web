import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { inject } from 'services';

const AdminRoute = ({ component: Component, ...rest }) => {
  const authService = inject('AuthService');

  return <Route {...rest} render={props => {
    const isLoginPath = /^\/login/.test(props.location.pathname);

    if (isLoginPath && authService.user) {
      // redirect to home page if user already logged in
      return <Redirect to="/"/>;
    }

    if (!isLoginPath && !authService.user) {
      // redirect to login page if user is not logged yet
      return <Redirect to="/login"/>;
    }

    return <Component {...props}/>;
  }}/>;
}

export default AdminRoute;
