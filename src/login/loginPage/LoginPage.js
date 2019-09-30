import React from 'react';

import './LoginPage.scss';
import LoginForm from '../loginForm/LoginForm';
import OtpForm from '../otpForm/OtpForm';
import { authService } from 'services';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      pending: false,
      otpNeeded: false
    };
  }
  render() {
    const { otpNeeded, pending } = this.state;
    return <div className="login-page">
      {otpNeeded ?
        <OtpForm onSubmit={this.otpSubmit} pending={pending}/> : 
        <LoginForm onSubmit={this.loginSubmit} pending={pending}/>}
    </div>;
  }

  loginSubmit = (data) => {
    this.loginData = data;
    this.setState({ pending: true }, () => {
      this.loginRequest(data);
    });
  }

  otpSubmit = (otp) => {
    this.setState({ pending: true }, () => {
      this.loginRequest({ ...this.loginData, otp });
    });
  }

  loginRequest(data) {
    authService.login(data).subscribe(res => {
      if (res.result === 'OTP_NEEDED') {
        this.setState({
          otpNeeded: true,
          pending: false
        });
      }
    }, err => {
      // TODO: handle login error
      console.error(err);
    });
  }
}

export default LoginPage;