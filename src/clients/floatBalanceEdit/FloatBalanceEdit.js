import React from 'react';

import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';

import { formatMoney } from 'src/core/utils';

import './FloatBalanceEdit.scss';

class FloatBalanceEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      amount: ''
    };
  }

  render() {
    const { state, props } = this;

    const curAmount = props.balance.amountValue;
    const newAmount = curAmount + (+state.amount);

    return <Modal open
      className="float-balance-edit"
      header="Change float balance"
      onClose={props.onClose}>
      <div className="grid-row">
        <div className="grid-col">Current amount: <b>{props.balance.amountMoney}</b></div>
        <div className="grid-col">New amount: <b>{formatMoney(newAmount, props.balance.currency)}</b></div>
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
    </Modal>;
  }

  inputChange = event => {
    this.setState({ amount: event.target.value });
  }

  changeClick = () => {
    this.props.onChange(+this.state.amount);
  }
}

export default FloatBalanceEdit;