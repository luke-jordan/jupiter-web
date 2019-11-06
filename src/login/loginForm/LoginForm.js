import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Spinner from 'src/components/spinner/Spinner';
import Input from 'src/components/input/Input';

import './LoginForm.scss';

class LoginForm extends React.Component {
  constructor() {
    super();

    this.authService = inject('AuthService');

    this.state = {
      loading: false,
      error: '',
      phoneOrEmail: 'someone@jupitersave.com',
      password: 'holy_CHRYSALIS_hatching9531'
    };

    unmountDecorator(this);
  }

  render() {
    const state = this.state;

    return <div className="card login-form">
      <div className="card-header">Log In</div>
      <div className="card-body">
        <form className="form" onSubmit={this.submit}>
          {state.error && <div className="login-error">{state.error}</div>}
          <div className="form-group">
            <div className="form-label">Phone Number or Email Address*</div>
            <Input name="phoneOrEmail" disabled={state.loading}
              value={state.phoneOrEmail} onChange={this.inputChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Password*</div>
            <Input type="password" name="password" disabled={state.loading}
              value={state.password} onChange={this.inputChange}/>
            <div className="forgot-password">
              <a href="/" className="link">Forgot Password?</a>
            </div>
          </div>
          <div className="login-actions">
            {state.loading ? <Spinner/> : <button className="button">Log In</button>}
          </div>
        </form>
      </div>
    </div>;
  }

  inputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  submit = (event) => {
    event.preventDefault();

    const { phoneOrEmail, password } = this.state;
    if (!phoneOrEmail || !password) {
      return;
    }

    this.setState({ loading: true, error: '' });

    this.authService.login({ phoneOrEmail, password }).pipe(
      takeUntil(this.unmount)
    ).subscribe(res => {
      if (res.result === 'OTP_NEEDED') {
        this.props.onOtpNeeded({ phoneOrEmail, password });
      }
    }, () => {
      this.setState({ loading: false, error: 'Incorrect phone/email or password' });
    });
  }
}

export default LoginForm;