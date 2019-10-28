import React from 'react';
import classNames from 'classnames';

import Input from 'src/components/input/Input';

import './FloatAllocationTable.scss';

class FloatAllocationTable extends React.Component {
  constructor(props) {
    super();

    this.state = {
      edit: false,
      confirm: false,
      data: this.getTableData(props.float)
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.float !== prevProps.float) {
      this.setState({
        data: this.getTableData(this.props.float)
      });
    }
  }

  render() {
    return <div className="float-allocation-table">
      {this.renderHeader()}
      {this.renderTable()}
    </div>;
  }

  renderHeader() {
    const { edit } = this.state;
    return <div className="section-header">
      <div className="header-text">Float Allocation</div>
      <div className="header-actions">
        {edit ?
          <>
            <button className="button button-outline button-small" onClick={this.saveClick}>Save</button>
            <button className="link" onClick={this.cancelClick}>Cancel</button>
          </> :
          <button className="button button-outline button-small" onClick={this.editClick}>Edit</button>
        }
      </div>
    </div>;
  }

  renderTable() {
    const className = classNames('table', { edit: this.state.edit });
    return <table className={className}>
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 200}}>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Bonus pool share of accrual</td>
          <td>{this.renderInputCell({ name: 'bonusPoolShareOfAccrual', unit: '%' })}</td>
        </tr>
        <tr>
          <td>Client share of accrual</td>
          <td>{this.renderInputCell({ name: 'clientShareOfAccrual', unit: '%' })}</td>
        </tr>
        <tr>
          <td>Accrual rate annual bps</td>
          <td>{this.renderInputCell({ name: 'accrualRateAnnualBps', unit: 'bps' })}</td>
        </tr>
        <tr>
          <td>Prudential Factor</td>
          <td>{this.renderInputCell({ name: 'prudentialFactor', unit: '%' })}</td>
        </tr>
      </tbody>
    </table>;
  }

  renderInputCell({ name, unit }) {
    const state = this.state;
    if (state.edit) {
      return <>
        <Input type="number" name={name} value={state.data[name]} onChange={this.inputChange}/> {unit}
      </>;
    } else {
      return `${state.data[name]}${unit}`;
    }
  }

  editClick = () => {
    this.setState({ edit: true });
  }

  cancelClick = () => {
    this.setState({
      edit: false,
      data: this.getTableData(this.props.float)
    });
  }

  saveClick = () => {
    this.setState({ edit: false });
    const data = this.state.data;
    this.props.onSave({
      bonusPoolShareOfAccrual: data.bonusPoolShareOfAccrual / 100,
      clientShareOfAccrual: data.clientShareOfAccrual / 100,
      accrualRateAnnualBps: data.accrualRateAnnualBps,
      prudentialFactor: data.prudentialFactor / 100
    });
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  getTableData(float) {
    return {
      bonusPoolShareOfAccrual: float.bonusPoolShareOfAccrual * 100,
      clientShareOfAccrual: float.clientShareOfAccrual * 100,
      accrualRateAnnualBps: float.accrualRateAnnualBps,
      prudentialFactor: float.prudentialFactor * 100
    };
  }
}

export default FloatAllocationTable;