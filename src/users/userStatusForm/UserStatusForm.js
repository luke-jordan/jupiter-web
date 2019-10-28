import React from 'react';

import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import { mapToOptions } from 'src/core/utils';
import { userStatusMap, userKycStatusMap } from 'src/core/constants';

import './UserStatusForm.scss';

class UserStatusForm extends React.Component {
  constructor() {
    super();
    this.userStatusOptions = mapToOptions(userStatusMap);
    this.kysStatusOptions = mapToOptions(userKycStatusMap);
  }

  render() {
    const { user, statusData } = this.props;

    const userStatusChanged = statusData.userStatus !== user.userStatus;
    const kycStatusChanged = statusData.kycStatus !== user.kycStatus;

    return <form className="user-status-form">
      <div className="status-header">Status</div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-label">User Status</div>
            <Select name="userStatus" value={statusData.userStatus} onChange={this.inputChange}>
              {this.userStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          {userStatusChanged && <>
            <div className="grid-col-4">
              <div className="form-label attention">Please provide a reason for the user status change:</div>
              <Input name="userStatusChangeReason" placeholder="Type reason here..." attention
                value={statusData.userStatusChangeReason} onChange={this.inputChange}/>
            </div>
            <div className="grid-col-4">
              <button type="button" className="button" onClick={() => this.submitStatus('status')}
                disabled={!statusData.userStatusChangeReason}>Change</button>
            </div>
          </>}
        </div>
      </div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col-4">
            <div className="form-label">KYC Status</div>
            <Select name="kycStatus" value={statusData.kycStatus} onChange={this.inputChange}>
              {this.kysStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          {kycStatusChanged && <>
            <div className="grid-col-4">
              <div className="form-label attention">Please provide a reason for the user KYC change:</div>
              <Input name="kycStatusChangeReason" placeholder="Type reason here..." attention
                value={statusData.kycStatusChangeReason} onChange={this.inputChange}/>
            </div>
            <div className="grid-col-4">
              <button type="button" className="button" onClick={() => this.submitStatus('kyc')}
                disabled={!statusData.kycStatusChangeReason}>Change</button>
            </div>
          </>}
        </div>
      </div>
    </form>;
  }

  inputChange = event => {
    if (this.props.onChange) {
      const { name, value } = event.target;
      this.props.onChange({ ...this.props.statusData, [name]: value });
    }
  }

  submitStatus = type => {
    if (this.props.onSubmitStatus) {
      this.props.onSubmitStatus(type);
    }
  }
}

export default UserStatusForm;