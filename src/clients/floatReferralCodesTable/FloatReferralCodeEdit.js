import React from 'react';

import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import TextArea from 'src/components/textArea/TextArea';

export default class FloatReferralCodeEdit extends React.Component {
  headerText = {
    new: 'Add referral code',
    edit: 'Edit referral code',
    duplicate: 'Duplicate referral code'
  };

  constructor(props) {
    super();
    this.state = {
      data: this.getFormData(props.data)
    };
  }

  render() {
    const mode = this.props.mode;
    const data = this.state.data;

    return <Modal className="float-referral-code-modal" open
      header={this.headerText[mode]}
      onClose={this.props.onCancel}>
      <form onSubmit={this.submit}>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Name</div>
              <Input name="referralCode" placeholder="Enter name"
                maxlength="50" disabled={mode === 'edit'}
                value={data.referralCode} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Type</div>
              <Select name="codeType" value={data.codeType} 
                disabled={mode === 'edit'} onChange={this.inputChange}>
                <option value="CHANNEL">Marketing channel</option>
                <option value="BETA">Early access</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Amount</div>
              <Input type="number" name="amount" placeholder="Enter bonus amount"
                value={data.amount} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Bonus Source</div>
              <Select name="bonusSource" value={data.bonusSource} onChange={this.inputChange}>
                <option value="SOURCE_1">Source 1</option>
                <option value="SOURCE_2">Source 2</option>
                <option value="SOURCE_3">Source 3</option>
              </Select>
            </div>
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-group">
              <div className="form-label">Add tags (optional)</div>
              <TextArea name="tags" placeholder="Enter tags separated by commas" rows="3" charsCounter={false}
                value={data.tags} onChange={this.inputChange} />
            </div>
          </div>
        </div>
        <div className="grid-row code-actions">
          <div className="grid-col">
            <span className="link text-underline" onClick={this.props.onCancel}>Cancel</span>
          </div>
          <div className="grid-col text-right">
            <button className="button">Add code</button>
          </div>
        </div>
      </form>
    </Modal>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  submit = event => {
    event.preventDefault();
    console.log(this.props.mode, this.state.data);
  }

  getFormData(data) {
    if (data) {
      return { ...data };
    }

    return {
      referralCode: '',
      codeType: 'CHANNEL',
      amount: '',
      bonusSource: '',
      tags: []
    };
  }
}
