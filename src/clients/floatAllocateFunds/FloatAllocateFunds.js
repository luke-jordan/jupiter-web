import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Modal from 'src/components/modal/Modal';
import RadioButton from 'src/components/radioButton/RadioButton';
import Spinner from 'src/components/spinner/Spinner';

import './FloatAllocateFunds.scss';

class FloatAllocateFunds extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      allocateTo: ''
    };

    this.allocateItems = [
      { value: 'BONUS_POOL', text: 'Bonus Pool' },
      { value: 'COMPANY_SHARE', text: 'Jupiter Savings SA' },
      { value: 'ALL_USERS', text: 'All Users' }
    ];

    unmountDecorator(this);
  }

  render() {
    return <Modal open
      className="float-allocate-funds"
      header="Manage float allocation"
      onClose={this.props.onClose}>
      {this.renderMessage()}
      {this.renderBalance()}
      {this.renderDeductFrom()}
      {this.renderActions()}
      {this.state.loading && <Spinner overlay/>}
    </Modal>
  }

  renderMessage() {
    return <div className="allocate-message">
      <b>The float bank balance and system balance do not match.</b><br/>
      Please deduct the necessary funds accordingly: 
    </div>;
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

  renderActions() {
    return <div className="grid-row actions">
      <div className="grid-col">
        <span className="link text-underline" onClick={this.props.onClose}>Cancel</span>
      </div>
      <div className="grid-col">
        <button className="button" onClick={this.confirm} disabled={!this.state.allocateTo}>
          Confirm
        </button>
      </div>
    </div>;
  }

  radioChecked = event => {
    this.setState({ allocateTo: event.target.value });
  }

  confirm = () => {
    this.setState({ loading: true });

    const { float, floatAlert } = this.props;
    const logContext = floatAlert.logContext;

    this.clientsService.updateClient({
      clientId: float.clientId,
      floatId: float.floatId,
      logId: floatAlert.logId,
      operation: 'ALLOCATE_FUNDS',
      amountToProcess: {
        currency: logContext.currency,
        unit: logContext.unit,
        amount: logContext.mismatch
      },
      allocateTo: this.state.allocateTo,
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.props.onCompleted();
    });
  }
}

export default FloatAllocateFunds;