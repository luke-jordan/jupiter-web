import React from 'react';

import './LoginPage.scss';
import LoginForm from '../loginForm/LoginForm';
import OtpForm from '../otpForm/OtpForm';
import { authService } from 'services';

class LoginPage extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      otpNeeded: false
    };
  }
  render() {
    const { otpNeeded, loading } = this.state;
    return <div className="login-page">
      {otpNeeded ?
        <OtpForm onSubmit={this.otpSubmit} loading={loading}/> : 
        <LoginForm onSubmit={this.loginSubmit} loading={loading}/>}
    </div>;
  }

  loginSubmit = (data) => {
    this.loginData = data;
    this.setState({ loading: true }, () => {
      this.loginRequest(data);
    });
  }

  otpSubmit = (otp) => {
    this.setState({ loading: true }, () => {
      this.loginRequest({ ...this.loginData, otp });
    });
  }

  loginRequest(data) {
    authService.login(data).subscribe(res => {
      if (res.result === 'OTP_NEEDED') {
        this.setState({
          otpNeeded: true,
          loading: false
        });
      }
    }, err => {
      // TODO: handle login error
      console.error(err);
      this.setState({ loading: false });
    });
  }
}

export default LoginPage;