import React from 'react';

import Spinner from 'components/spinner/Spinner';
import Input from 'components/input/Input';

import './OtpForm.scss';

class OtpForm extends React.Component {
  constructor() {
    super();
    this.state = {
      digits: ['1', '2', '3', '4']
    };
  }

  render() {
    const { loading } = this.props;
    const { digits } = this.state;
    return <div className="card otp-form">
      <div className="card-header">Please enter the OTP pin sent to:</div>
      <div className="card-body">
      <div className="phone-num">********87</div>
        <form className="form" onSubmit={this.submit}>
          <div className="digits">
            {digits.map((digit, index) => {
              return <Input value={digit} maxLength="1" disabled={loading}
                onChange={this.inputChange} name={`digit-${index}`} key={index}/>
            })}
          </div>
          <div className="form-actions">
            {loading ? <Spinner/> : <button className="button">Continue</button>}
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
    const pin = this.state.digits.join('');
    if (pin.length === 4) {
      this.props.onSubmit(pin);
    }
  }
}

export default OtpForm;