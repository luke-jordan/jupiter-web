import React from 'react';

import './FloatAllocationTable.scss';

class FloatAllocationTable extends React.Component {
  render() {
    const float = this.props.float;
    return <div className="float-allocation-table">
      <div className="section-header">Float Allocation</div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th style={{width: 150}}>Value</th>
            <th style={{width: 200}}>Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bonus pool share of accrual</td>
            <td>{float.bonusPoolShareOfAccrual * 100}%</td>
            <td></td>
          </tr>
          <tr>
            <td>Client share of accrual</td>
            <td>{float.clientShareOfAccrual * 100}%</td>
            <td></td>
          </tr>
          <tr>
            <td>Accrual rate annual bps</td>
            <td>{float.accrualRateAnnualBps}Bps</td>
            <td></td>
          </tr>
          <tr>
            <td>Prudential Factor</td>
            <td>{float.prudentialFactor * 100}%</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

export default FloatAllocationTable;