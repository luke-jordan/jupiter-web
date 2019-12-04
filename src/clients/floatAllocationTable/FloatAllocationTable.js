import React from 'react';
import classNames from 'classnames';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Input from 'src/components/input/Input';
import Modal from 'src/components/modal/Modal';
import Spinner from 'src/components/spinner/Spinner';

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

    this.clientsService = inject('ClientsService');
    this.modalService = inject('ModalService');

    this.state = {
      edit: false,
      confirmOpen: false,
      confirmLoading: false,
      reason: '',
      changes: null,
      ...this.getFloatData(props.float)
    };

    unmountDecorator(this);
  }

  getFloatData(float) {
    const data = {
      bonusPoolShareOfAccrual: this.processPercent(float.bonusPoolShareOfAccrual),
      clientShareOfAccrual: this.processPercent(float.clientShareOfAccrual),
      accrualRateAnnualBps: float.accrualRateAnnualBps.toString(),
      prudentialFactor: this.processPercent(float.prudentialFactor)
    };
    return { data, initialData: { ...data } };
  }

  componentDidUpdate(prevProps) {
    if (this.props.float !== prevProps.float) {
      this.setState(this.getFloatData(this.props.float));
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
    return <div className="section-header">
      <div className="header-text">Float Allocation</div>
      <div className="header-actions">
        {this.state.edit ?
          <>
            <button className="button button-outline button-small" onClick={this.saveClick}
              disabled={!this.canSave()}>
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

    if (!state.confirmOpen) {
      return;
    }

    const rows = this.itemsConfig.filter(item => state.changes[item.name]).map(item => {
      return <tr key={item.name}>
        <td>{item.title}</td>
        <td>{state.changes[item.name].oldValue}{item.unit}</td>
        <td>{state.changes[item.name].newValue || 0}{item.unit}</td>
      </tr>
    });

    return <Modal className="float-allocation-table-confirm" open
      header="Confirm Changes"
      onClose={this.cancelConfirm}>
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
      <div className="reason-message">
        Please specify <b>reason</b> for the changes above:
      </div>
      <Input className="reason-input" placeholder="Reason" value={state.reason}
        onChange={e => this.setState({ reason: e.target.value })}/>
      <div className="grid-row confirm-actions">
        <div className="grid-col">
          <span className="link text-underline" onClick={this.cancelConfirm}>Cancel</span>
        </div>
        <div className="grid-col text-right">
          <button className="button" disabled={!state.reason.trim()}
            onClick={this.continueClick}>Continue</button>
        </div>
      </div>
      {state.confirmLoading && <Spinner overlay/>}
    </Modal>;
  }

  editClick = () => {
    this.setState({ edit: true });
  }

  cancelClick = () => {
    this.setState({
      edit: false,
      data: { ...this.state.initialData },
      changes: null
    });
  }

  saveClick = () => {
    this.setState({ confirmOpen: true });
  }

  cancelConfirm = () => {
    this.setState({ confirmOpen: false, reason: '' });
  }

  continueClick = () => {
    this.setState({ confirmLoading: true });

    this.clientsService.updateClient(this.getReqBody()).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({
        edit: false,
        confirmOpen: false,
        confirmLoading: false,
        reason: '',
        changes: null
      });
      this.props.onSaved();
    }, () => {
      this.setState({
        confirmOpen: false,
        confirmLoading: false
      });
      this.modalService.openCommonError();
    });
  }

  inputChange = event => {
    const { name, value } = event.target;
    const data = { ...this.state.data, [name]: value };
    this.setState({ data, changes: this.getChanges(data) });
  }

  getChanges(data) {
    const initialData = this.state.initialData;
    let changes = null;

    Object.keys(data).forEach(key => {
      const newValue = data[key];
      const oldValue = initialData[key];
      if (newValue !== oldValue) {
        changes = changes || {};
        changes[key] = { newValue, oldValue };
      }
    });

    return changes;
  }

  getReqBody() {
    const state = this.state;
    const float = this.props.float;

    const newAccrualVars = {};

    this.itemsConfig.forEach(item => {
      if (item.name in state.changes) {
        const value = state.changes[item.name].newValue;
        newAccrualVars[item.name] = item.unit === '%' ? value / 100 : +value;
      }
    });

    return {
      clientId: float.clientId,
      floatId: float.floatId,
      operation: 'ADJUST_ACCRUAL_VARS',
      newAccrualVars,
      reasonToLog: state.reason
    };
  }

  canSave() {
    const state = this.state;
    return (
      state.changes &&
      Object.entries(state.data).every(([key, value]) => value)
    );
  }

  processPercent(value) {
    value = (value * 100).toFixed(2);
    if (value.endsWith('00')) {
      value = value.slice(0, -3);
    } else if (value.endsWith('0')) {
      value = value.slice(0, -1);
    }
    return value;
  }
}

export default FloatAllocationTable;