import React from 'react';
import classNames from 'classnames';

import { messageDisplayTypeMap } from 'src/core/constants';
import { mapToOptions } from 'src/core/utils';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import TextArea from 'src/components/textArea/TextArea';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';

import './MessageForm.scss';

class MessageForm extends React.Component {
  constructor(props) {
    super();
    this.typeOptions = mapToOptions(messageDisplayTypeMap);

    this.state = {
      data: this.messageToFormData(props.message)
    };
  }

  detailsHeaderText = {
    new: 'Enter message details',
    view: 'Message details',
    edit: 'Edit message details',
    duplicate: 'Edit message details'
  };

  conditionsHeaderText = {
    new: 'Specify conditions',
    view: 'Conditions',
    edit: 'Edit conditions',
    duplicate: 'Edit conditions'
  };

  submitButtonText = {
    new: 'Submit',
    view: 'Edit',
    edit: 'Update',
    duplicate: 'Submit'
  };

  isView() {
    return this.props.mode === 'view';
  }

  componentDidUpdate(prevProps) {
    if (this.props.message !== prevProps.message) {
      this.setState({
        data: this.messageToFormData(this.props.message)
      });
    }
  }

  render() {
    return <form className="message-form" onSubmit={this.submit}>
      <div className="grid-row">
        {this.renderDetails()}
        {this.renderConditions()}
      </div>
      {this.renderAudienceSelection()}
      <div className="form-group text-right">
        <button className="button">{this.submitButtonText[this.props.mode]}</button>
      </div>
    </form>;
  }

  renderDetails() {
    const { props, state } = this;
    return <div className="grid-col msg-details">
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">{this.detailsHeaderText[props.mode]}</div>
      </div>
      <div className={classNames('details-box', { 'view-mode': this.isView() })}>
        {/* Title */}
        <div className="form-group">
          <div className="form-label">Title</div>
          <Input placeholder="Enter title" name="title" disabled={this.isView()}
            value={state.data.title} onChange={this.inputChange}/>
        </div>
        {/* Body */}
        <div className="form-group">
          <div className="form-label">Body</div>
          <TextArea rows="8" placeholder="Enter body" name="body"
            value={state.data.body} onChange={this.inputChange} disabled={this.isView()}/>
        </div>
        {/* Quick action */}
        <div className="form-group">
          <div className="form-label">Quick action from message</div>
          <Select placeholder="Select action" name="quickAction" disabled={this.isView()}
            value={state.data.quickAction} onChange={this.inputChange}>
            <option value="VIEW_HISTORY">View history</option>
            <option value="ADD_CASH">Add cash</option>
            <option value="VISIT_WEB">Visit website</option>
          </Select>
        </div>
        {/* Url to visit */}
        {state.data.quickAction === 'VISIT_WEB' && <div className="form-group">
          <div className="form-label">Url to visit</div>
          <Input placeholder="Enter website url" name="urlToVisit" disabled={this.isView()}
            value={state.data.urlToVisit} onChange={this.inputChange}/>
        </div>}
      </div>
    </div>;
  }

  renderConditions() {
    const { props, state } = this;
    return <div className="grid-col msg-conditions">
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">{this.conditionsHeaderText[props.mode]}</div>
      </div>
      {/* Type */}
      <div className="form-group">
        <div className="form-label">Set display type</div>
        <Select name="type" disabled={this.isView()}
          value={state.data.type} onChange={this.inputChange}>
          {this.typeOptions.map(item => 
            <option key={item.value} value={item.value}>{item.text}</option>)}
        </Select>
      </div>
      {/* Priority */}
      <div className="form-group">
        <div className="form-label">Assign a priority (0=low, 100=high)</div>
        <Input type="number" name="priority" disabled={this.isView()}
          value={state.data.priority} onChange={this.inputChange}/>
      </div>
      {/* Send message (recurrence) */}
      <div className="form-group">
        <div className="form-label">Send message</div>
        <Select name="recurrence" disabled={this.isView()}
          value={state.data.recurrence} onChange={this.inputChange}>
          <option value="ONCE_OFF">Only now</option>
          <option value="RECURRING">Repeatedly</option>
          <option value="EVENT_DRIVEN">When some event occurs</option>
        </Select>
      </div>
      {state.data.recurrence === 'RECURRING' && <>
        {/* Recurring min interval days */}
        <div className="form-group">
          <div className="form-label">Assign minimum days between sending messages</div>
          <Input type="number" name="recurringMinIntervalDays" disabled={this.isView()}
            value={state.data.recurringMinIntervalDays} onChange={this.inputChange}/>
        </div>
        {/* Recurring max in queue */}
        <div className="form-group">
          <div className="form-label">Skip sending if more than X messages have been sent</div>
          <Input type="number" name="recurringMaxInQueue" disabled={this.isView()}
            value={state.data.recurringMaxInQueue} onChange={this.inputChange} />
        </div>
      </>}
      {/* Event type and category */}
      {state.data.recurrence === 'EVENT_DRIVEN' && <div className="form-group">
        <div className="form-label">Event type and category</div>
        <Input name="eventTypeCategory" disabled={this.isView()}
          value={state.data.eventTypeCategory} onChange={this.inputChange}/>
      </div>}
    </div>;
  }

  renderAudienceSelection() {
    return /(new|duplicate)/.test(this.props.mode) ?
      <AudienceSelection client={this.props.clients[0]} sectionNum="3"
        ref={ref => this.audienceRef = ref}/> : null;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({
      data: { ...this.state.data, [name]: value }
    });
  }

  submit = event => {
    event.preventDefault();

    if (this.audienceRef && !this.audienceRef.isValid()) {
      this.audienceRef.showInvalidMessage();
      return;
    }

    this.props.onSubmit(this.getMessageReqBody(), this.getAudienceReqBody());
  }

  messageToFormData(message) {
    if (!message) {
      return {
        title: '',
        body: '',
        quickAction: 'ADD_CASH',
        type: 'CARD',
        priority: 0,
        recurrence: 'EVENT_DRIVEN',
        recurringMinIntervalDays: 0,
        recurringMaxInQueue: 0,
        eventTypeCategory: 'REFERRAL::REDEEMED::REFERRER',
        urlToVisit: ''
      };
    }

    const defaultTemplate = message.templates.template.DEFAULT;
    const recurrenceParameters = message.recurrenceParameters;

    return {
      title: defaultTemplate.title,
      body: defaultTemplate.body,
      quickAction: defaultTemplate.actionToTake,
      type: defaultTemplate.display.type,
      priority: message.messagePriority,
      recurrence: message.presentationType,
      recurringMinIntervalDays: recurrenceParameters ? recurrenceParameters.minIntervalDays : 0,
      recurringMaxInQueue: recurrenceParameters ? recurrenceParameters.maxInQueue : 0,
      eventTypeCategory: (message.flags && message.flags[0]) ? message.flags[0] : '',
      urlToVisit: defaultTemplate.urlToVisit
    };
  }

  getMessageReqBody() {
    const data = this.state.data;

    const body = {
      audienceType: 'GROUP',
      templates: {
        template: {
          DEFAULT: {
            title: data.title,
            body: data.body,
            display: { type: data.type },
            actionToTake: data.quickAction,
            urlToVisit: data.urlToVisit
          }
        }
      },
      messagePriority: parseInt(data.priority),
      presentationType: data.recurrence
    };

    if (data.recurrence === 'RECURRING') {
      body.recurrenceParameters = {
        minIntervalDays: data.recurringMinIntervalDays,
        maxInQueue: data.recurringMaxInQueue
      };
    } else if (data.recurrence === 'EVENT_DRIVEN') {
      if (this.state.mode === 'edit') {
        body.flags = [data.eventTypeCategory];
      } else {
        body.eventTypeCategory = data.eventTypeCategory;
      }
    }

    return body;
  }

  getAudienceReqBody() {
    return this.audienceRef ? this.audienceRef.getReqBody() : null;
  }

  reset() {
    this.setState({ data: this.messageToFormData(null) });
    this.audienceRef && this.audienceRef.reset();
  }
}

export default MessageForm;
