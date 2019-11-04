import React from 'react';
import { takeUntil } from 'rxjs/operators';

import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Spinner from 'src/components/spinner/Spinner';

import { formatMoney, inject, unmountDecorator } from 'src/core/utils';

import './FloatBalanceEdit.scss';

class FloatBalanceEdit extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      amount: '',
      loading: false
    };

    unmountDecorator(this);
  }

  render() {
    const { state, props } = this;
    const floatBalane = props.float.floatBalance;

    const curAmount = floatBalane.amountValue;
    const newAmount = curAmount + (+state.amount);

    return <Modal open
      className="float-balance-edit"
      header="Change float balance"
      onClose={props.onClose}>
      <div className="grid-row">
        <div className="grid-col">Current amount: <b>{floatBalane.amountMoney}</b></div>
        <div className="grid-col">New amount: <b>{formatMoney(newAmount, floatBalane.currency)}</b></div>
      </div>
      <div className="balance-edit-message">
        Enter positive value to add to balance or enter negative value to subtract from balance
      </div>
      <div className="grid-row">
        <div className="grid-col-9">
          <Input type="number" value={state.amount} onChange={this.inputChange}/>
        </div>
        <div className="grid-col-3">
        <button className="button change-button" onClick={this.changeClick}
          disabled={!state.amount || curAmount === newAmount || newAmount < 0}>Change</button>
        </div>
      </div>
      {state.loading && <Spinner overlay/>}
    </Modal>;
  }

  inputChange = event => {
    this.setState({ amount: event.target.value });
  }

  changeClick = () => {
    this.setState({ loading: true });

    const amount = +this.state.amount;
    const float = this.props.float;
    const floatAlert = this.props.floatAlert;

    this.clientsService.updateFloatBalance({
      clientId: float.clientId,
      floatId: float.floatId,
      amount: amount * 100,
      unit: 'WHOLE_CENT',
      currency: float.floatBalance.currency,
      logId: floatAlert ? floatAlert.logId : undefined
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.props.onCompleted();
    });
  }
}

export default FloatBalanceEdit;