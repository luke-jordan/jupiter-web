import React from 'react';

import Select from 'src/components/select/Select';
import Input from 'src/components/input/Input';
import { mapToOptions } from 'src/core/utils';
import { userStatusMap, userKycStatusMap, userRegulatoryStatusMap } from 'src/core/constants';

import './UserStatusForm.scss';

import UserFileModal from '../userFileModal/UserFileModal';
import { inject, unmountDecorator } from 'src/core/utils';

class UserStatusForm extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');

    this.userStatusOptions = mapToOptions(userStatusMap);
    this.kycStatusOptions = mapToOptions(userKycStatusMap);
    this.regulatoryStatusOptions = mapToOptions(userRegulatoryStatusMap);

    this.state = this.getState(props.user);

    unmountDecorator(this);
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
      bSheetIdEdit: false,
      regulatoryStatus: user.regulatoryStatus,
      regulatoryStatusEdit: false,
      showUploadFileModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      this.setState( this.getState(this.props.user) );
    }
  }

  render() {
    return <form className="user-status-form">
      <div className="grid-row">
        <div className="grid-col-9">
          {this.renderUserStatus()}
          {this.renderKycStatus()}
          {this.renderRegulatoryStatus()}
          {this.renderBSheetId()}
        </div>
        <div className="grid-col-3">
          {this.renderPwdResetBtn()}
        </div>
      </div>
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
            {this.kycStatusOptions.map((item) => <option key={item.value} value={item.value}>{item.text}</option>)}
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

  renderRegulatoryStatus() {
    const state = this.state;
    return <div className="form-group">
      <div className="grid-row">
        <div className="grid-col-4">
          <div className="form-label">Regulatory (stokvel) status</div>
          <Select name="regulatoryStatus" value={state.regulatoryStatus} onChange={this.inputChange}
            disabled={state.userStatusEdit || state.regulatoryStatusEdit || state.bSheetIdEdit}>
            {this.regulatoryStatusOptions.map((item) => <option key={item.value} value={item.value}>{item.text}</option>)}
          </Select>
        </div>
        {state.regulatoryStatusEdit && <>
          <div className="grid-col-4">
            <div className="form-label attention">Please provide a reason for the user regulatory status change:</div>
            <Input name="regulatoryStatusReason" placeholder="Type reason here..." attention
              value={state.regulatoryStatusReason} onChange={this.inputChange}/>
          </div>
          <div className="grid-col-4 change-actions">
            <button type="button" className="button" onClick={this.regulatoryStatusChangeClick}
              disabled={!state.regulatoryStatusReason}>Change</button>
            <span className="link" onClick={this.regulatoryStatusCancelClick}>Cancel</span>
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
    return (<>
      {this.actionButton('Reset user password', this.pwdResetClick)}
      {this.actionButton('Stop messages (email/PN)', this.blockMsgClick)}
      {this.actionButton('Upload a file', this.uploadFileClick)}
      {this.actionButton('Manual OTP', this.otpFlowClick)}
    </>);
  }

  actionButton = (text, onClick) => (
    <div className="form-group grid-row">
      <button type="button" className="button" onClick={onClick}>{text}</button>
    </div>
  );

  inputChange = event => {
    const { name, value } = event.target;
    const newState = { ...this.state, [name]: value };

    if (name === 'userStatus') {
      newState.userStatusEdit = true;
    } else if (name === 'kycStatus') {
      newState.kycStatusEdit = true;
    } else if (name === 'regulatoryStatus') {
      newState.regulatoryStatusEdit = true;
    } else if (name === 'bSheetId') {
      newState.bSheetIdEdit = true;
    } else if (name === 'fileLogDescription') {
      newState.fileLogDescribed = true;
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

  regulatoryStatusChangeClick = () => {
    const state = this.state;
    this.submit({
      fieldToUpdate: 'REGULATORY',
      newStatus: state.regulatoryStatus,
      reasonToLog: state.regulatoryStatusReason
    });
  }

  pwdResetClick = () => {
    this.submit({
      fieldToUpdate: 'PWORD',
      reasonToLog: 'Password update',
    }, false);
  };

  otpFlowClick = () => {
    this.submit({
      fieldToUpdate: 'OTP',
      reasonToLog: 'Manual OTP flow'
    }, false);
  };

  blockMsgClick = () => {
    this.submit({
      fieldToUpdate: 'MESSAGE_PREFERENCES',
      reasonToLog: 'User message update'
    }, false)
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

  submit(data, reloadAfterSubmit) {
    data.systemWideUserId = this.props.user.systemWideUserId;
    this.props.onSubmit(data, reloadAfterSubmit);
  }

  /**
   * We can move all of this later, for now this React pattern of creating 35 different folders/files so each one has
   * 10 lines and it's all "encapsulated" is causing more difficulty than it is probably worth
   */
  uploadFileClick = () => {
    // show a modal, then deal with file messiness
    this.modalService.openModal(
      <UserFileModal
        onClose={() => this.modalService.closeModal()}
        onSelectFile={this.onSelectFileHandler}
        onSetDescription={this.inputChange}
        onClickUpload={this.onClickUploadFileForUser}
      />
    )
  }

  onSelectFileHandler = (event) => {
    this.setState({
      selectedFileToUpload: event.target.files[0]
    })
  };

  onClickUploadFileForUser = event => {
    event.preventDefault();
    if (!this.state.selectedFileToUpload) {
      this.modalService.closeModal();
      this.modalService.openInfo('Error', 'Please select a file');
      return;
    }

    const reader = new FileReader();
    const file = this.state.selectedFileToUpload;

    reader.onload = (event) => {
      const base64content = event.target.result.split('base64,')[1];;

      const data = {
        systemWideUserId: this.props.user.systemWideUserId,
        logDescription: this.state.fileLogDescription,
        file: {
          filename: file.name,
          mimeType: file.type,
          fileContent: base64content,
        }
      };

      this.props.onUpload(data);
    }

    reader.readAsDataURL(file);
  }

}

export default UserStatusForm;
