import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
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
      {this.renderReason()}
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
      {type === 'USER_SAVING_EVENT' && <button className="button button-outline button-small"
        onClick={() => this.openReason(transaction, 'Mark transaction as received', 'SETTLED')}>Mark as received</button>}
      {type === 'WITHDRAWAL' && <button className="button button-outline button-small"
        onClick={() => this.openReason(transaction, 'Complete transaction withdrawal', 'SETTLED')}>Complete withdrawal</button>}
      <button className="button button-outline button-small"
        onClick={() => this.openReason(transaction, 'Cancel transaction', 'EXPIRED')}>Cancel</button>
    </td>
  }

  renderReason() {
    const reasonData = this.state.reasonData;
    return reasonData && <Modal open className="transaction-change-reason" header={reasonData.modalHeader}
      onClose={this.closeReason}>
      <form onSubmit={this.submit}>
        <div className="reason-msg">Please enter reason below</div>
        <div className="grid-row">
          <div className="grid-col-9">
            <Input name="reason" placeholder="Enter reason"
              value={reasonData.reasonText} onChange={this.reasonInputChange}/>
          </div>
          <div className="grid-col-3">
            <button className="button" disabled={!reasonData.reasonText.trim()}>Submit</button>
          </div>
        </div>
      </form>
      {this.state.loading && <Spinner overlay/>}
    </Modal>;
  }

  openReason(transaction, modalHeader, newStatus) {
    this.setState({
      reasonData: {
        transactionId: transaction.transactionId, modalHeader, newStatus, reasonText: ''
      }
    });
  }

  closeReason = () => {
    this.setState({ reasonData: null, loading: false });
  }

  reasonInputChange = e => {
    this.setState({ 
      reasonData: { ...this.state.reasonData, reasonText: e.target.value }
    });
  }

  submit = e => {
    e.preventDefault();

    this.setState({ loading: true });

    const reasonData = this.state.reasonData;

    this.usersService.updateUser({
      systemWideUserId: this.props.user.systemWideUserId,
      fieldToUpdate: 'TRANSACTION',
      reasonToLog: reasonData.reasonText,
      newTxStatus: reasonData.newStatus,
      transactionId: reasonData.transactionId
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.closeReason();
      this.props.onChanged();
    }, () => {
      this.closeReason();
      this.modalService.openCommonError();
    });
  }
}

export default UserTransactions;
