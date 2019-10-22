import React from 'react';
import { NavLink } from 'react-router-dom';

import { inject, tempStorage } from 'utils';

import './UserDetails.scss';
import userIcon from 'assets/images/user-circle-blue.svg';
import arrowRightWhite from 'assets/images/arrow-right-white.svg';

class UserDetails extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');
  }

  render() {
    return <div className="user-details card">
      {this.renderHeader()}
      <div className="card-body">
        {this.renderPendingTransactions()}
      </div>
    </div>;
  }

  renderHeader() {
    const user = this.props.user;
    return <div className="card-header">
      <div className="user-icon">
        <img className="user-image" src={userIcon} alt="user"/>
        <div className="user-name">
          <div className="user-name-text">{user.fullName}</div>
          <div className="user-start-date">User since {user.formattedStartDate}</div>
        </div>
      </div>
      <div className="user-balance">
        <div className="balance-label">Total jupiter balance</div>
        <div className="balance-value">{user.userBalance.currentBalance.amountMoney}</div>
      </div>
    </div>;
  }

  renderPendingTransactions() {
    const rows = this.props.user.pendingTransactions.map(transaction => {
      return <tr key={transaction.transactionId}>
        <td>{transaction.formattedCreationDate}</td>
        <td>{transaction.amountMoney}</td>
        <td className="transaction-buttons">
          <button className="button button-outline button-small">Mark as received</button>
          <button className="button button-outline button-small">Cancel</button>
        </td>
      </tr>;
    });

    return <div className="user-transactions">
      <header className="transactions-header">Pending EFT Transactions</header>
      <table className="table">
        <thead>
          <tr>
            <th style={{width: 150}}>Date</th>
            <th style={{width: 150}}>EFT amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      <NavLink className="button view-history" onClick={this.saveHistoryToTempStorage}
        to={{ pathname: '/users/history', search: this.historyService.location.search }}>
        View user history <img className="button-icon" src={arrowRightWhite} alt="arrow"/>
      </NavLink> 
    </div>;
  }

  saveHistoryToTempStorage = () => {
    tempStorage.set('user-history', this.props.user);
  }
}

export default UserDetails;