import React from 'react';

import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import { NavLink } from 'react-router-dom';
import { mapToOptions } from 'src/core/utils';
import { userStatusMap, userKycStatusMap } from 'src/core/constants';

import './UserStatusForm.scss';

class UserStatusForm extends React.Component {
  constructor(props) {
    super();

    this.userStatusOptions = mapToOptions(userStatusMap);
    this.kysStatusOptions = mapToOptions(userKycStatusMap);

    this.state = this.getState(props.user);
  }

  getState(user) {
    return {
      userStatus: user.userStatus,
      userStatusEdit: false,
      userStatusReason: '',
      kycStatus: user.kycStatus,
      kycStatusEdit: false,
      kycStatusReason: '',
      bSheetId: user.userBalance.bsheetIdentifier || '',
      bSheetIdEdit: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState( this.getState(this.props.user) );
    }
  }

  render() {
    return <form className="user-status-form">
      <div className="status-header">Status</div>
      {this.renderUserStatus()}
      {this.renderKycStatus()}
      {this.renderBSheetId()}
      {this.renderPwdResetBtn()}
    </form>;
  }

  renderUserStatus() {
    const state = this.state;
    return <div className="form-group">
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-label">User Status</div>
          <Select name="userStatus" value={state.userStatus} onChange={this.inputChange}
            disabled={state.kycStatusEdit || state.bSheetIdEdit}>
            {this.userStatusOptions.map((item) => <option key={item.value} value={item.value}>{item.text}</option>)}
          </Select>
        </div>
        {state.userStatusEdit && <>
          <div className="grid-col-4">
            <div className="form-label attention">Please provide a reason for the user status change:</div>
            <Input name="userStatusReason" placeholder="Type reason here..." attention
              value={state.userStatusReason} onChange={this.inputChange}/>
          </div>
          <div className="grid-col-4 change-actions">
            <button type="button" className="button" onClick={this.userStatusChangeClick}
              disabled={!state.userStatusReason}>Change</button>
            <span className="link" onClick={this.userStatusCancelClick}>Cancel</span>
          </div>
        </>}
      </div>
    </div>;
  }

  renderKycStatus() {
    const state = this.state;
    return <div className="form-group">
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-label">KYC Status</div>
          <Select name="kycStatus" value={state.kycStatus} onChange={this.inputChange}
            disabled={state.userStatusEdit || state.bSheetIdEdit}>
            {this.kysStatusOptions.map((item) => <option key={item.value} value={item.value}>{item.text}</option>)}
          </Select>
        </div>
        {state.kycStatusEdit && <>
          <div className="grid-col-4">
            <div className="form-label attention">Please provide a reason for the user KYC change:</div>
            <Input name="kycStatusReason" placeholder="Type reason here..." attention
              value={state.kycStatusReason} onChange={this.inputChange}/>
          </div>
          <div className="grid-col-4 change-actions">
            <button type="button" className="button" onClick={this.kycStatusChangeClick}
              disabled={!state.kycStatusReason}>Change</button>
            <span className="link" onClick={this.kycStatusCancelClick}>Cancel</span>
          </div>
        </>}
      </div>
    </div>;
  }

  renderBSheetId() {
    const state = this.state;
    return <div className="form-group">
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-label">FinWorks Account Number</div>
          <Input name="bSheetId" placeholder="Enter number" value={state.bSheetId}
            onChange={this.inputChange} disabled={state.userStatusEdit || state.kycStatusEdit}/>
        </div>
        {state.bSheetIdEdit && <div className="grid-col-4 change-actions">
          <button type="button" className="button" onClick={this.bSheetIdChangeClick}
            disabled={!state.bSheetId || !state.bSheetId.trim()}>Change</button>
          <span className="link" onClick={this.bSheetIdCancelClick}>Cancel</span>
        </div>}
      </div>
    </div>;
  }

  renderPwdResetBtn() {
    const state = this.state;
    return <div className="page-actions">
      <button type="button" className="button" onClick={this.pwdResetClick}>Reset user password</button>
    </div>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    const newState = { ...this.state, [name]: value };

    if (name === 'userStatus') {
      newState.userStatusEdit = true;
    } else if (name === 'kycStatus') {
      newState.kycStatusEdit = true;
    } else if (name === 'bSheetId') {
      newState.bSheetIdEdit = true;
    }

    this.setState(newState);
  }

  userStatusChangeClick = () => {
    const state = this.state;
    this.submit({
      fieldToUpdate: 'STATUS',
      newStatus: state.userStatus,
      reasonToLog: state.userStatusReason
    });
  }

  userStatusCancelClick = () => {
    this.setState({
      ...this.state,
      userStatus: this.props.user.userStatus,
      userStatusEdit: false,
      userStatusReason: ''
    });
  }

  kycStatusChangeClick = () => {
    const state = this.state;
    this.submit({
      fieldToUpdate: 'KYC',
      newStatus: state.kycStatus,
      reasonToLog: state.kycStatusReason
    });
  }

  pwdResetClick = () => {
    this.submit({
      fieldToUpdate: 'PWORD',
      reasonToLog: 'Password update',
    });
  };

  kycStatusCancelClick = () => {
    this.setState({
      ...this.state,
      kycStatus: this.props.user.kycStatus,
      kycStatusEdit: false,
      kycStatusReason: ''
    });
  }

  bSheetIdChangeClick = () => {
    const state = this.state;
    this.submit({
      fieldToUpdate: 'BSHEET',
      newIdentifier: state.bSheetId,
      reasonToLog: 'Change BSHEET',
      accountId: this.props.user.userBalance.accountId[0]
    });
  }

  bSheetIdCancelClick = () => {
    this.setState({
      ...this.state,
      bSheetId: this.props.user.userBalance.bsheetIdentifier || '',
      bSheetIdEdit: false
    });
  }

  submit(data) {
    data.systemWideUserId = this.props.user.systemWideUserId;
    this.props.onSubmit(data);
  }
}

export default UserStatusForm;