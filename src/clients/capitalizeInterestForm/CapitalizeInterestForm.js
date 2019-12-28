import React from 'react';

import { inject } from 'src/core/utils';
import Input from 'src/components/input/Input';
import DatePicker from 'src/components/datePicker/DatePicker';
import Modal from 'src/components/modal/Modal';

import './CapitalizeInterestForm.scss';

class CapitalizeInterestForm extends React.Component {
  constructor() {
    super();

    this.historyService = inject('HistoryService');

    this.state = {
      open: false,
      data: this.getDefaultData()
    };
  }

  render() {
    return <div className="capitalize-interest-form">
      <button className="button" onClick={this.capitalizeClick}>Capitalize interest</button>
      {this.renderModal()}
    </div>;
  }

  renderModal() {
    const state = this.state;
    return <Modal open={state.open}
      className="capitalize-interest-form-modal"
      header="Capitalize interest"
      onClose={this.cancelClick}>
      <form onSubmit={this.submit}>
        <div className="grid-row">
          <div className="grid-col">
            <div className="form-label">Interest paid</div>
            <Input type="number" name="amount" placeholder="Enter amount"
              value={state.data.amount} onChange={this.inputChange}/>
          </div>
          <div className="grid-col">
            <div className="form-label">Date and time paid</div>
            <DatePicker selected={state.data.date}
              placeholderText="Select date"
              showClear={false}
              showTimeSelect={true}
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              onChange={value => this.inputChange({ target: { name: 'date', value } })} />
          </div>
        </div>
        <div className="grid-row actions">
          <div className="grid-col">
            <span className="link text-underline" onClick={this.cancelClick}>Cancel</span>
          </div>
          <div className="grid-col text-right">
            <button className="button" disabled={!this.canPreview()}>Preview</button>
          </div>
        </div>
      </form>
    </Modal>;
  }

  capitalizeClick = () => {
    this.setState({ open: true });
  }

  cancelClick = () => {
    this.setState({ open: false, data: this.getDefaultData() });
  }

  submit = () => {
    const pathname = this.historyService.location.pathname;
    const data = this.state.data;
    const params = new URLSearchParams({ amount: data.amount, date: data.date.getTime() });
    this.historyService.push(`${pathname}/capitalize-interest?${params}`);
  }

  getDefaultData() {
    return { amount: '0', date: new Date() };
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  canPreview() {
    const data = this.state.data;
    return data.amount && data.date;
  }
}

export default CapitalizeInterestForm;
