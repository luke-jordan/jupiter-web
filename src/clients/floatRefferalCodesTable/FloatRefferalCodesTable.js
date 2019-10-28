import React from 'react';

import './FloatRefferalCodesTable.scss';

class FloatRefferalCodesTable extends React.Component {
  render() {
    return <div className="float-refferal-codes-table">
      {this.renderHeader()}
      {this.renderTable()}
    </div>;
  }

  renderHeader() {
    return <div className="section-header">
      <div className="header-text">Active Referral Codes</div>
      <div className="header-actions">
        <div className="button button-small button-outline">Add new code</div>
      </div>
    </div>
  }

  renderTable() {
    return <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 150}}>Type</th>
          <th style={{width: 100}}># Used</th>
          <th style={{width: 100}}>Bonus</th>
          <th style={{width: 300}}>Tags</th>
          <th style={{width: 40}}></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="6" className="no-data">No codes</td>
        </tr>
      </tbody>
    </table>;
  }
}

export default FloatRefferalCodesTable;