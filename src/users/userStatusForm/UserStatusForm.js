import React from 'react';

import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import { mapToOptions } from 'src/core/utils';
import { userStatusMap, userKycStatusMap } from 'src/core/constants';

import './UserStatusForm.scss';

class UserStatusForm extends React.Component {
  constructor(props) {
    super();

    this.userStatusOptions = mapToOptions(userStatusMap);
    this.kysStatusOptions = mapToOptions(userKycStatusMap);

    this.state = {
      data: this.getFormData(props.user)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState({
        data: this.getFormData(this.props.user)
      });
    }
  }

  render() {
    const { state, props } = this;

    const userStatusChanged = state.data.userStatus !== props.user.userStatus;
    const kycStatusChanged = state.data.kycStatus !== props.user.kycStatus;

    return <form className="user-status-form">
      <div className="status-header">Status</div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-label">User Status</div>
            <Select name="userStatus" value={state.data.userStatus} onChange={this.inputChange}>
              {this.userStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          {userStatusChanged && <>
            <div className="grid-col-4">
              <div className="form-label attention">Please provide a reason for the user status change:</div>
              <Input name="userStatusChangeReason" placeholder="Type reason here..." attention
                value={state.data.userStatusChangeReason} onChange={this.inputChange}/>
            </div>
            <div className="grid-col-4">
              <button type="button" className="button" onClick={this.userStatusChangeClick}
                disabled={!state.data.userStatusChangeReason}>Change</button>
            </div>
          </>}
        </div>
      </div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-label">KYC Status</div>
            <Select name="kycStatus" value={state.data.kycStatus} onChange={this.inputChange}>
              {this.kysStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          {kycStatusChanged && <>
            <div className="grid-col-4">
              <div className="form-label attention">Please provide a reason for the user KYC change:</div>
              <Input name="kycStatusChangeReason" placeholder="Type reason here..." attention
                value={state.data.kycStatusChangeReason} onChange={this.inputChange}/>
            </div>
            <div className="grid-col-4">
              <button type="button" className="button" onClick={this.kysStatusChangeClick}
                disabled={!state.data.kycStatusChangeReason}>Change</button>
            </div>
          </>}
        </div>
      </div>
    </form>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  userStatusChangeClick = () => {
    const { userStatus, userStatusChangeReason } = this.state.data;
    this.submit({ userStatus, userStatusChangeReason });
  }

  kysStatusChangeClick = () => {
    const { kycStatus, kycStatusChangeReason } = this.state.data;
    this.submit({ kycStatus, kycStatusChangeReason });
  }

  submit(data) {
    this.props.onSubmit(data);
  }

  getFormData(user) {
    return {
      userStatus: user.userStatus,
      userStatusChangeReason: '',
      kycStatus: user.kycStatus,
      kycStatusChangeReason: ''
    };
  }
}

export default UserStatusForm;