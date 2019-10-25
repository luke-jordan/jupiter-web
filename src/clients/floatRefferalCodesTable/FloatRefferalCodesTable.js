import React from 'react';

import './FloatRefferalCodesTable.scss';

class FloatRefferalCodesTable extends React.Component {
  render() {
    return <div className="float-refferal-codes-table">
      <div className="section-header">Active Referral Codes</div>
      <table className="table">
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
      </table>
    </div>;
  }
}

export default FloatRefferalCodesTable;