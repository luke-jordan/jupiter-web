import React from 'react';
import { NavLink } from 'react-router-dom';

import { inject, tempStorage } from 'utils';

import './UserTransactions.scss';
import arrowRightWhite from 'assets/images/arrow-right-white.svg';

class UserTransactions extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');
  }

  render() {
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
          {rows.length ? rows : <tr><td colSpan="3" className="no-data">No transactions</td></tr>}
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

export default UserTransactions;