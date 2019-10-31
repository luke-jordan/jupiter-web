import React from 'react';

import FloatBalanceEdit from '../floatBalanceEdit/FloatBalanceEdit';

import './FloatAlertActions.scss';

class FloatAlertActions extends React.Component {
  constructor() {
    super();
    this.state = {
      editBalance: false
    };
  }

  render() {
    const config = this.getActionConfig();
    return <div className="float-alert-actions">
      <div className="alert-status">{config.status}</div>
      <span className="link text-underline" onClick={config.click}>{config.action}</span>
      {this.renderBalanceEdit()}
    </div>;
  }

  renderBalanceEdit() {
    return this.state.editBalance ?
      <FloatBalanceEdit float={this.props.float} floatAlert={this.props.floatAlert}
        onClose={() => this.toggleEditBalance(false)}
        onChanged={() => this.toggleEditBalance(false)}/> : null;
  }

  getActionConfig() {
    const floatAlert = this.props.floatAlert;
    if (floatAlert.logType === 'ALLOCATION_TOTAL_MISMATCH') {
      return {
        status: 'Allocation mismatch', action: 'Allocate funds'
      };
    } else if (floatAlert.logType === 'BALANCE_MISMATCH') {
      return {
        status: 'Balance mismatch', action: 'Add/subtract funds',
        click: () => this.toggleEditBalance(true)
      };
    } else if (floatAlert.isResolved) {
      return {
        status: 'Resolved', action: 'Mark as unresolved'
      };
    } else {
      return {
        status: 'Unresolved', action: 'Mark as resolved'
      }
    }
  }

  toggleEditBalance = editBalance => {
    this.setState({ editBalance });
  }
}

export default FloatAlertActions;