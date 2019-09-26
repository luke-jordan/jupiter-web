import React from 'react';

import './LoginPage.scss';
import LoginForm from '../loginForm/LoginForm';
import OtpForm from '../otpForm/OtpForm';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = { otpNeeded: false };
  }
  render() {
    return <div className="login-page">
      {this.state.otpNeeded ?
        <OtpForm onSubmit={this.otpHandler}/> : 
        <LoginForm onSubmit={this.loginHandler}/>}
      
    </div>;
  }

  loginHandler = (data) => {
    console.log('Login data', data);
    this.setState({ otpNeeded: true });
  }

  otpHandler = (pin) => {
    console.log('OTP pin', pin);
  }
}

export default LoginPage;