import React from 'react';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';
import LoginForm from '../loginForm/LoginForm';
import OtpForm from '../otpForm/OtpForm';

import './LoginPage.scss';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = { otpLoginData: null };
  }

  render() {
    const { otpLoginData } = this.state;
    return <div className="login-page">
      {otpLoginData ? <OtpForm loginData={otpLoginData}/> : 
        <LoginForm onOtpNeeded={otpLoginData => this.setState({ otpLoginData })}/>}
    </div>;
  }
}

export default errorBoundary(LoginPage);