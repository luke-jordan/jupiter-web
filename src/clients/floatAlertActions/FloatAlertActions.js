import React from 'react';

import FloatBalanceEdit from '../floatBalanceEdit/FloatBalanceEdit';
import FloatAlertResolve from '../floatAlertResolve/FloatAlertResolve';

import './FloatAlertActions.scss';

class FloatAlertActions extends React.Component {
  constructor() {
    super();
    this.state = {
      actionOpen: false
    };
  }

  render() {
    return <div className="float-alert-actions">{this.renderAction()}</div>;
  }

  renderAction() {
    const { float, floatAlert } = this.props;
    const { actionOpen } = this.state;

    if (floatAlert.logType === 'ALLOCATION_TOTAL_MISMATCH') {
      return <>
        {this.renderActionStatus('Allocation mismatch', 'Allocate funds')}
      </>;
    }

    if (floatAlert.logType === 'BALANCE_MISMATCH') {
      return <>
        {this.renderActionStatus('Balance mismatch', 'Add/subtrack funds')}
        {actionOpen && <FloatBalanceEdit
          float={float}
          floatAlert={floatAlert}
          onClose={this.closeAction}
          onCompleted={this.actionCompleted}/>}
      </>;
    }

    return <>
      {this.renderActionStatus(
        floatAlert.isResolved ? 'Resolved': 'Unresolved',
        `Mark as ${floatAlert.isResolved ? 'unresolved' : 'resolved'}`
      )}
      {actionOpen && <FloatAlertResolve
        float={float}
        floatAlert={floatAlert}
        onClose={this.closeAction}
        onCompleted={this.actionCompleted}/>}
    </>;
  }

  renderActionStatus(status, action) {
    return <>
      <div className="alert-status">{status}</div>
      <span className="link text-underline"
        onClick={() => this.setState({ actionOpen: true })}>{action}</span>
    </>;
  }
  
  closeAction = () => {
    this.setState({ actionOpen: false });
  }

  actionCompleted = () => {
    this.setState({ actionOpen: false });
    this.props.onCompleted();
  }
}

export default FloatAlertActions;