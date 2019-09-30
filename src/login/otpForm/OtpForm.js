import React from 'react';

import './OtpForm.scss';

class OtpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      digits: ['1', '2', '3', '4']
    };
  }

  render() {
    const { digits } = this.state;
    return <div className="card otp-form">
      <div className="card-header">Please enter the OTP pin sent to:</div>
      <div className="phone-num">********87</div>
      <form className="form" onSubmit={this.submit}>
        <div className="digits">
          {digits.map((digit, index) => {
            return <input className="form-input" value={digit} maxLength="1"
              onChange={this.inputChange} name={`digit-${index}`} key={index}/>
          })}
        </div>
        <button className="button" disabled={this.props.pending}>Continue</button>
      </form>
      <div className="otp-help">
        <p>Didn't receive the OTP pin? <a href="/" className="link">Resend</a></p>
        <p>What is a one-time password? <a href="/" className="link">Help</a></p>
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
    const pin = this.state.digits.join('');
    if (pin.length === 4) {
      this.props.onSubmit(pin);
    }
  }
}

export default OtpForm;