import React from 'react';

import Spinner from 'src/components/spinner/Spinner';
import Input from 'src/components/input/Input';

import './LoginForm.scss';

class LoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      phoneOrEmail: 'someone@jupitersave.com',
      password: 'holy_CHRYSALIS_hatching9531'
    };
  }

  render() {
    const { loading } = this.props;
    const { phoneOrEmail, password } = this.state;
    return <div className="card login-form">
      <div className="card-header">Log In</div>
      <div className="card-body">
        <form className="form" onSubmit={this.submit}>
          <div className="form-group">
            <div className="form-label">Phone Number or Email Address*</div>
            <Input name="phoneOrEmail" disabled={loading}
              value={phoneOrEmail} onChange={this.inputChange}/>
          </div>
          <div className="form-group">
            <div className="form-label">Password</div>
            <Input type="password" name="password" disabled={loading}
              value={password} onChange={this.inputChange}/>
            <div className="forgot-password">
              <a href="/" className="link">Forgot Password?</a>
            </div>
          </div>
          <div className="form-actions">
            {loading ? <Spinner/> : <button className="button">Log In</button>}
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
    if (phoneOrEmail && password) {
      this.props.onSubmit({ phoneOrEmail, password });
    }
  }
}

export default LoginForm;