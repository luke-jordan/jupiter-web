import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator, revertAmount } from 'src/core/utils';
import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Spinner from 'src/components/spinner/Spinner';

import './UserTransactions.scss';

class UserTransactions extends React.Component {
  constructor() {
    super();

    this.usersService = inject('UsersService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      reasonData: null
    };

    unmountDecorator(this);
  }

  render() {
    return <div className="user-transactions">
      <header className="transactions-header">Pending EFT Transactions</header>
      {this.renderTable()}
      {this.renderTransactionStatusChangeModal()}
      {this.renderTransactionAmountModal()}
    </div>;
  }

  renderTable() {
    const rows = this.props.user.pendingTransactions.map(transaction => {
      return <tr key={transaction.transactionId}>
        <td>{transaction.formattedCreationDate}</td>
        <td>{transaction.transactionTypeText}</td>
        <td>{transaction.amountMoney}</td>
        <td>{transaction.humanReference}</td>
        {this.renderTransactionActions(transaction)}
      </tr>;
    });

    return <table className="table">
      <thead>
        <tr>
          <th style={{width: 120}}>Date</th>
          <th style={{width: 120}}>Type</th>
          <th style={{width: 120}}>EFT amount</th>
          <th style={{width: 150}}>Bank ref</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows : <tr><td colSpan="5" className="no-data">No transactions</td></tr>}
      </tbody>
    </table>;
  }

  renderTransactionActions(transaction) {
    const type = transaction.transactionType;
    return <td className="transaction-actions">
      <button className="button button-outline button-small"
        onClick={() => this.openTransactionAmountModal(transaction)}>Change amount</button>
      {type === 'USER_SAVING_EVENT' && <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Mark transaction as received', 'SETTLED')}>Mark as received</button>}
      {type === 'WITHDRAWAL' && <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Complete transaction withdrawal', 'SETTLED')}>Complete withdrawal</button>}
      <button className="button button-outline button-small"
        onClick={() => this.openTransactionStatus(transaction, 'Cancel transaction', 'CANCELLED')}>Cancel</button>
    </td>
  }

  renderTransactionAmountModal() {
    const txAmountData = this.state.txAmountData;
    return txAmountData &&
    <Modal open className="transaction-change-reason" header="Change amount" onClose={this.closeTransactionAmountModal}>
    <form onSubmit={this.submitAmountChange}>
      <div className="reason-msg">Enter the changed amount</div>
      <div className="grid-row">
        <div className="grid-col-6">
          <span class="reason-msg">Current value:</span>
          <Input name="oldValue" placeholder={this.state.txAmountData.currentAmountDisplay} disabled/>
        </div>
        <div className="grid-col-6">
          <span class="reason-msg">New value:</span> 
          <Input name="newValue" type="number" value={txAmountData.newAmountValue} onChange={this.amountValueInputChange}/>
        </div>
      </div>
      <div className="reason-msg" style={{ marginTop: 10 }}>Please enter reason below</div>
      <div className="grid-row">
        <div className="grid-col-9">
          <Input name="reason" placeholder="Enter reason"
            value={txAmountData.reasonText} onChange={this.amountReasonInputChange}/>
        </div>
        <div className="grid-col-3">
          <button className="button" disabled={!txAmountData.reasonText.trim()}>Submit</button>
        </div>
      </div>
    </form>
    {this.state.loading && <Spinner overlay/>}
  </Modal>;
  }

  openTransactionAmountModal(transaction) {
    this.setState({
      txAmountData: {
        transactionId: transaction.transactionId,
        currentAmountDisplay: transaction.amountMoney,
        newAmountValue: transaction.amountValue,
        newAmountRaw: revertAmount(transaction.amountValue, transaction.unit),
        transactionUnit: transaction.unit,
        transactionCurrency: transaction.currency,
        transactionAmount: transaction.amount, 
        reasonText: ''
      }
    });
  }

  closeTransactionAmountModal = () => {
    this.setState({ txAmountData: null, loading: false });
  }

  amountValueInputChange = e => {
    this.setState({
      txAmountData: { ...this.state.txAmountData, newAmountValue: e.target.value }
    })
  }

  amountReasonInputChange = e => {
    this.setState({ 
      txAmountData: { ...this.state.txAmountData, reasonText: e.target.value }
    });
  }

  renderTransactionStatusChangeModal() {
    const reasonData = this.state.reasonData;
    return reasonData && 
    <Modal open className="transaction-change-reason" header={reasonData.modalHeader} onClose={this.closeTransactionStatus}>
      <form onSubmit={this.submitStatusChange}>
        <div className="reason-msg">Please enter reason below</div>
        <div className="grid-row">
          <div className="grid-col-9">
            <Input name="reason" placeholder="Enter reason"
              value={reasonData.reasonText} onChange={this.statusReasonInputChange}/>
          </div>
          <div className="grid-col-3">
            <button className="button" disabled={!reasonData.reasonText.trim()}>Submit</button>
          </div>
        </div>
      </form>
      {this.state.loading && <Spinner overlay/>}
    </Modal>;
  }

  openTransactionStatus(transaction, modalHeader, newStatus) {
    this.setState({
      reasonData: {
        transactionId: transaction.transactionId, 
        modalHeader, 
        newStatus, 
        reasonText: ''
      }
    });
  }

  closeTransactionStatus = () => {
    this.setState({ reasonData: null, loading: false });
  }

  statusReasonInputChange = e => {
    this.setState({ 
      reasonData: { ...this.state.reasonData, reasonText: e.target.value }
    });
  }

  submitUserChange = ({ transactionId, reasonText, newStatus, newAmount }) => {
    this.setState({ loading: true });

    const newTxStatus = newStatus; // todo : clean up convention on backend eventually

    this.usersService.updateUser({
      systemWideUserId: this.props.user.systemWideUserId,
      fieldToUpdate: 'TRANSACTION',
      reasonToLog: reasonText,
      newTxStatus,
      newAmount,
      transactionId,
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.closeTransactionStatus();
      this.closeTransactionAmountModal();
      this.props.onChanged();
    }, () => {
      this.closeTransactionStatus();
      this.closeTransactionAmountModal();
      this.modalService.openCommonError();
    });
  }

  submitStatusChange = e => {
    e.preventDefault();
    const reasonData = this.state.reasonData;
    this.submitUserChange(reasonData);
  }

  submitAmountChange = e => {
    e.preventDefault();

    const { txAmountData } = this.state;
    const newAmount = {
      amount: revertAmount(txAmountData.newAmountValue, txAmountData.transactionUnit),
      unit: txAmountData.transactionUnit,
      currency: txAmountData.transactionCurrency,
    }

    this.submitUserChange({ ...txAmountData, newAmount });
  }
  
}

export default UserTransactions;
