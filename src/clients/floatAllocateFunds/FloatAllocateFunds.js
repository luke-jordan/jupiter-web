import React from 'react';
import { takeUntil } from 'rxjs/operators';

import Modal from 'src/components/modal/Modal';
import RadioButton from 'src/components/radioButton/RadioButton';

import './FloatAllocateFunds.scss';

class FloatAllocateFunds extends React.Component {
  constructor() {
    super();

    this.state = {
      allocateTo: ''
    };

    this.allocateItems = [
      { value: 'BONUS_POOL', text: 'Bonus Pool' },
      { value: 'COMPANY_SHARE', text: 'Jupiter Savings SA' },
      { value: 'ALL_USERS', text: 'All Users' }
    ];
  }

  render() {
    return <Modal open
      className="float-allocate-funds"
      header="Manage float allocation"
      onClose={this.props.onClose}>
      <div className="allocate-message">
        <b>The float bank balance and system balance do not match.</b><br/>
        Please deduct the necessary funds accordingly: 
      </div>
      {this.renderBalance()}
      {this.renderDeductFrom()}
      <div className="grid-row actions">
        <div className="grid-col">
          <span className="link text-underline" onClick={this.props.onClose}>Cancel</span>
        </div>
        <div className="grid-col">
          <button className="button" onClick={this.confirm} disabled={!this.state.allocateTo}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  }

  renderBalance() {
    const logContext = this.props.floatAlert.logContext;
    return <div className="allocate-balance">
      <div className="grid-row">
        <div className="grid-col-7">Bank balance</div>
        <div className="grid-col-5">{logContext.floatAccountsTotalMoney}</div>
      </div>
      <div className="grid-row">
        <div className="grid-col-7">System balance</div>
        <div className="grid-col-5">{logContext.accountsTxTotalMoney}</div>
      </div>
      <div className="info-divider"></div>
      <div className="grid-row">
        <div className="grid-col-7">Total balance difference</div>
        <div className="grid-col-5">-{logContext.mismatchMoney}</div>
      </div>
    </div>;
  }

  renderDeductFrom() {
    const logContext = this.props.floatAlert.logContext;
    const state = this.state;
    return <div className="deduct-from">
      <header>Deduct the difference of {logContext.mismatchMoney} from:</header>
      <div>
        {this.allocateItems.map(item => 
          <RadioButton key={item.value} value={item.value} checked={state.allocateTo === item.value}
            onChange={this.radioChecked}>{item.text}</RadioButton>)}
      </div>
    </div>;
  }

  radioChecked = event => {
    this.setState({ allocateTo: event.target.value });
  }

  confirm = () => {
    console.log(this.state);
  }
}

export default FloatAllocateFunds;