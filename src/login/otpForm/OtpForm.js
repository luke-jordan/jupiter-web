import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Spinner from 'src/components/spinner/Spinner';
import Input from 'src/components/input/Input';

import './OtpForm.scss';

class OtpForm extends React.Component {
  constructor() {
    super();

    this.authService = inject('AuthService');

    this.state = {
      loading: false,
      error: '',
      digits: ['1', '2', '3', '4']
    };

    unmountDecorator(this);
  }

  render() {
    const state = this.state;

    return <div className="card otp-form">
      <div className="card-header">Please enter the OTP pin sent to:</div>
      <div className="card-body">
        <form className="form" onSubmit={this.submit}>
          {state.error && <div className="login-error">{state.error}</div>}
          <div className="phone-num">********87</div>
          <div className="digits">
            {state.digits.map((digit, index) => {
              return <Input value={digit} maxLength="1" disabled={state.loading}
                onChange={this.inputChange} name={`digit-${index}`} key={index}/>
            })}
          </div>
          <div className="login-actions">
            {state.loading ? <Spinner/> : <button className="button">Continue</button>}
          </div>
        </form>
        <div className="otp-help">
          <p>Didn't receive the OTP pin? <a href="/" className="link">Resend</a></p>
          <p>What is a one-time password? <a href="/" className="link">Help</a></p>
        </div>
      </div>
    </div>;
  }

  inputChange = (event) => {
    const index = +event.target.name.replace('digit-', '');
    const value = event.target.value;

    if (value && isNaN(+value)) {
      return;
    }

    const digits = this.state.digits.slice();
    digits[index] = value;
    this.setState({ digits });
  }

  submit = (event) => {
    event.preventDefault();

    const otp = this.state.digits.join('');
    if (otp.length < 4) {
      return;
    }

    this.setState({ loading: true, error: '' });

    this.authService.login({ ...this.props.loginData, otp }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {

    }, () => {
      this.setState({ loading: false, error: 'Incorrect pin' });
    });
  }
}

export default OtpForm;