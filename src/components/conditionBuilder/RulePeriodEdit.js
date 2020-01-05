import React from 'react';
import moment from 'moment';

import Modal from 'src/components/modal/Modal';
import DatePicker from 'src/components/datePicker/DatePicker';

class RulePeriodEdit extends React.Component {
  constructor(props) {
    super();

    this.state = {
      startTime: props.item.startTime,
      endTime: props.item.endTime
    };
  }

  render() {
    const { state, props } = this;

    return <Modal open header="Select period of time"
      className="condition-builder-period-edit" onClose={props.onClose}>
      <div className="grid-row">
        <div className="grid-col-6">
          <div className="form-label">Start time</div>
          <DatePicker selected={state.startTime} onChange={value => this.dateChange(value, 'startTime')}/>
        </div>
        <div className="grid-col-6">
          <div className="form-label">End time</div>
          <DatePicker selected={state.endTime} onChange={value => this.dateChange(value, 'endTime')}/>
        </div>
      </div>
      <div className="grid-row actions">
        <div className="grid-col-6">
          <span className="link text-underline" onClick={props.onClose}>Cancel</span>
        </div>
        <div className="grid-col-6 text-right">
          <button className="button" onClick={this.okClick}>Ok</button>
        </div>
      </div>
    </Modal>;
  }

  dateChange(date, prop) {
    this.setState({ [prop]: date });
  }

  okClick = () => {
    const state = this.state;

    const startTime = state.startTime ? +moment(state.startTime).startOf('day') : undefined;
    const endTime = state.endTime ? +moment(state.endTime).endOf('day') : undefined;

    this.props.onEvent({
      action: 'rule:period-change',
      item: this.props.item,
      startTime,
      endTime
    });
  }
}

export default RulePeriodEdit;