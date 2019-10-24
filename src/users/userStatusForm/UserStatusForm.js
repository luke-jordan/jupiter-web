import React from 'react';

import Select from 'src/components/select/Select';
import { dictToOptions } from 'src/core/utils';
import { userStatusMap, userKycStatusMap } from 'src/core/dictionaries';

import './UserStatusForm.scss';

class UserStatusForm extends React.Component {
  constructor() {
    super();
    this.userStatusOptions = dictToOptions(userStatusMap);
    this.kysStatusOptions = dictToOptions(userKycStatusMap);
  }

  render() {
    const user = this.props.user;
    return <form className="user-status-form">
      <div className="status-header">Status</div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-label">User Status</div>
            <Select name="userStatus" value={user.userStatus} onChange={this.userStatusChange}>
              {this.userStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          <div className="grid-col"></div>
          <div className="grid-col"></div>
        </div>
      </div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-label">KYC Status</div>
            <Select name="kycStatus" value={user.kycStatus} onChange={this.kycStatusChange}>
              {this.kysStatusOptions.map((item) =>
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
          <div className="grid-col"></div>
          <div className="grid-col"></div>
        </div>
      </div>
    </form>;
  }

  userStatusChange = event => {
 
  }

  kycStatusChange = event => {

  }
}

export default UserStatusForm;