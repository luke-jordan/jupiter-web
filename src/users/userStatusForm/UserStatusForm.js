import React from 'react';

import Select from 'src/components/select/Select';

import './UserStatusForm.scss';

class UserStatusForm extends React.Component {
  render() {
    return <form className="user-status-form">
      <div className="status-header">Status</div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-label">User Status</div>
            <Select name="userStatus"/>
          </div>
          <div className="grid-col"></div>
          <div className="grid-col"></div>
        </div>
      </div>
      <div className="form-group">
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-label">KYC Status</div>
            <Select name="kycStatus"/>
          </div>
          <div className="grid-col"></div>
          <div className="grid-col"></div>
        </div>
      </div>
    </form>;
  }
}

export default UserStatusForm;