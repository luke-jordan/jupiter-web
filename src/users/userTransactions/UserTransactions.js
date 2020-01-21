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
    this.authService = inject('AuthService');

    this.state = {
      loading: false,
      openReason: false,
      reason: '',
      transactionId: null,
      newStatus: null
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
        <td className="transaction-actions">
          <button className="button button-outline button-small"
            onClick={() => this.openReason(transaction, 'SETTLED')}>Mark as received</button>
          <button className="button button-outline button-small"
            onClick={() => this.openReason(transaction, 'EXPIRED')}>Cancel</button>
        </td>
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

  renderReason() {
    const state = this.state;

    if (!state.openReason) {
      return;
    }

    const header = {
      SETTLED: 'Mark transaction as received',
      EXPIRED: 'Cancel transaction'
    }[state.newStatus];

    return <Modal open className="transaction-change-reason" header={header}
      onClose={this.closeReason}>
      <form onSubmit={this.submit}>
        <div className="reason-msg">Please enter reason below</div>
        <div className="grid-row">
          <div className="grid-col-9">
            <Input name="reason" placeholder="Enter reason"
              value={state.reason} onChange={this.reasonInputChange}/>
          </div>
          <div className="grid-col-3">
            <button className="button" disabled={!state.reason.trim()}>Submit</button>
          </div>
        </div>
      </form>
      {state.loading && <Spinner overlay/>}
    </Modal>;
  }

  openReason(transaction, newStatus) {
    this.setState({
      openReason: true,
      reason: '',
      transactionId: transaction.transactionId,
      newStatus
    });
  }

  closeReason = () => {
    this.setState({ openReason: false, loading: false });
  }

  reasonInputChange = e => {
    this.setState({ reason: e.target.value });
  }

  submit = e => {
    e.preventDefault();

    this.setState({ loading: true });

    const state = this.state;

    this.usersService.updateUser({
      systemWideUserId: this.authService.user.value.systemWideUserId,
      fieldToUpdate: 'TRANSACTION',
      reasonToLog: state.reason,
      newTxStatus: state.newStatus,
      transactionId: state.transactionId
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
