import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { inject } from 'src/utils';

const AdminRoute = ({ component: Component, ...rest }) => {
  const authService = inject('AuthService');

  return <Route {...rest} render={props => {
    const isLoginPath = /^\/login/.test(props.location.pathname);
    const user = authService.user.value;

    if (isLoginPath && user) {
      // redirect to home page if user already logged in
      return <Redirect to="/"/>;
    }

    if (!isLoginPath && !user) {
      // redirect to login page if user is not logged yet
      return <Redirect to="/login"/>;
    }

    return <Component {...props}/>;
  }}/>;
}

export default AdminRoute;
