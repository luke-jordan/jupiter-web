import React from 'react';
import classNames from 'classnames';

import Input from 'src/components/input/Input';
import Modal from 'src/components/modal/Modal';

import './FloatAllocationTable.scss';

class FloatAllocationTable extends React.Component {
  itemsConfig = [{
    name: 'bonusPoolShareOfAccrual',
    title: 'Bonus pool share of accrual',
    unit: '%'
  }, {
    name: 'clientShareOfAccrual',
    title: 'Client share of accrual',
    unit: '%'
  }, {
    name: 'accrualRateAnnualBps',
    title: 'Accrual rate annual bps',
    unit: 'bps'
  }, {
    name: 'prudentialFactor',
    title: 'Prudential Factor',
    unit: '%'
  }];

  constructor(props) {
    super();

    this.state = {
      edit: false,
      data: this.floatToTableData(props.float),
      changes: {},
      confirmOpen: false,
      confirmValue: '',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.float !== prevProps.float) {
      this.setState({
        data: this.floatToTableData(this.props.float)
      });
    }
  }

  render() {
    return <div className="float-allocation-table">
      {this.renderHeader()}
      {this.renderTable()}
      {this.renderConfirm()}
    </div>;
  }

  renderHeader() {
    const state = this.state;
    const hasChanges = Object.keys(state.changes).length > 0;

    return <div className="section-header">
      <div className="header-text">Float Allocation</div>
      <div className="header-actions">
        {state.edit ?
          <>
            <button className="button button-outline button-small" onClick={this.saveClick}
              disabled={!hasChanges}>
              Save
            </button>
            <button className="link text-underline" onClick={this.cancelClick}>Cancel</button>
          </> :
          <button className="button button-outline button-small" onClick={this.editClick}>Edit</button>
        }
      </div>
    </div>;
  }

  renderTable() {
    const state = this.state;

    const rows = this.itemsConfig.map(item => {
      return <tr key={item.name}>
        <td>{item.title}</td>
        <td>
          {state.edit ?
            <><Input type="number" name={item.name}
                value={state.data[item.name]} onChange={this.inputChange}/> {item.unit}</> :
            `${state.data[item.name]}${item.unit}`}
        </td>
      </tr>;
    });

    const className = classNames('table', { edit: state.edit });

    return <table className={className}>
      <thead>
        <tr>
          <th>Name</th>
          <th style={{width: 200}}>Value</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>;
  }

  renderConfirm() {
    const { props, state } = this;

    const rows = this.itemsConfig.filter(item => state.changes[item.name]).map(item => {
      return <tr key={item.name}>
        <td>{item.title}</td>
        <td>{state.changes[item.name].oldValue}</td>
        <td>{state.changes[item.name].newValue}</td>
      </tr>
    });

    return <Modal className="float-allocation-table-confirm"
      open={state.confirmOpen}
      header="Confirm Changes"
      onClose={this.closeConfirm}>
      <div className="confirm-message">
        You are about to make the following changes to Float: <b>{props.float.floatName}</b>
      </div>
      <table className="table table-compact">
        <thead>
          <tr>
            <th>Name</th>
            <th style={{width: 150}}>Value</th>
            <th style={{width: 150}}>Amended value</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <div className="confirm-message">
        Please type <b>"confirmed"</b> in the box below to agree to the above changes:
      </div>
      <Input className="confirm-input" value={state.confirmValue}
        onChange={e => this.setState({ confirmValue: e.target.value })}/>
      <div className="grid-row confirm-actions">
        <div className="grid-col">
          <span className="link text-underline" onClick={this.closeConfirm}>Cancel</span>
        </div>
        <div className="grid-col text-right">
          <button className="button" disabled={state.confirmValue !== 'confirmed'}
            onClick={this.continueClick}>Continue</button>
        </div>
      </div>
    </Modal>;
  }

  editClick = () => {
    this.setState({ edit: true });
  }

  cancelClick = () => {
    this.setState({
      edit: false, data: this.floatToTableData(this.props.float), changes: {}
    });
  }

  saveClick = () => {
    this.setState({ confirmOpen: true });
  }

  continueClick = () => {
    this.setState({
      edit: false,
      confirmOpen: false,
      confirmValue: ''
    });

    const data = {};
    Object.entries(this.state.changes).forEach(([key, value]) => data[key] = value.newValue);

    this.props.onSave(data);
  }

  inputChange = event => {
    const { name, value } = event.target;

    const data = { ...this.state.data, [name]: value };
    const changes = { ...this.state.changes };

    const oldValue = this.floatToTableData(this.props.float)[name];
    const newValue = data[name];

    if (+newValue !== oldValue) {
      changes[name] = { oldValue, newValue };
    } else {
      delete changes[name];
    }

    this.setState({ data, changes });
  }

  closeConfirm = () => {
    this.setState({ confirmOpen: false, confirmValue: '' });
  }

  floatToTableData(float) {
    return {
      bonusPoolShareOfAccrual: float.bonusPoolShareOfAccrual * 100,
      clientShareOfAccrual: float.clientShareOfAccrual * 100,
      accrualRateAnnualBps: float.accrualRateAnnualBps,
      prudentialFactor: float.prudentialFactor * 100
    };
  }
}

export default FloatAllocationTable;