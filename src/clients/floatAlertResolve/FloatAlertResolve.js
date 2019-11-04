import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import Modal from 'src/components/modal/Modal';
import Input from 'src/components/input/Input';
import Spinner from 'src/components/spinner/Spinner';

import './FloatAlertResolve.scss';

class FloatAlertResolve extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      reason: '',
      loading: false
    };

    unmountDecorator(this);
  }

  render() {
    const state = this.state;
    const floatAlert = this.props.floatAlert;

    const header = floatAlert.isResolved ? 'Reopen alert' : 'Resolve alert';
    const msg = `Please enter the reason for <b>${floatAlert.isResolved ? 'reopening': 'resolving'}</b> alert`;
    const submitText = floatAlert.isResolved ? 'Reopen' : 'Resolve';

    return <Modal open
      className="float-alert-resolve"
      header={header}
      onClose={this.props.onClose}>
      <form onSubmit={this.submit}>
        <div className="resolve-message" dangerouslySetInnerHTML={{__html: msg}}></div>
        <div className="grid-row">
          <div className="grid-col-9">
            <Input placeholder="Reason" value={state.reason} onChange={this.inputChange}/>
          </div>
          <div className="grid-col-3">
            <button className="button" disabled={!state.reason.trim()}>{submitText}</button>
          </div>
        </div>
      </form>
      {state.loading && <Spinner overlay/>}
    </Modal>;
  }

  inputChange = event => {
    this.setState({ reason: event.target.value });
  }

  submit = event => {
    event.preventDefault();

    this.setState({ loading: true });

    const { float, floatAlert } = this.props;
    const methodName = floatAlert.isResolved ? 'reopenFloatAlert' : 'resolveFloatAlert';

    this.clientsService[methodName]({
      clientId: float.clientId,
      floatId: float.floatId,
      reasonToLog: this.state.reason,
      logId: floatAlert.logId
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.props.onCompleted();
    });
  }
}

export default FloatAlertResolve;