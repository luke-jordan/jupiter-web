import React from 'react';
import classNames from 'classnames';

import { messageDisplayTypeMap } from 'src/core/constants';
import { mapToOptions } from 'src/core/utils';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import DatePicker from 'src/components/datePicker/DatePicker';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';
import TextEditor from 'src/components/textEditor/TextEditor';

import './MessageForm.scss';

class MessageForm extends React.Component {
  constructor(props) {
    super();

    this.typeOptions = mapToOptions(messageDisplayTypeMap);

    this.htmlTypes = ['EMAIL', 'MODAL'];

    this.bodyParameters = [
      'user_first_name',
      'user_full_name',
      'current_balance',
      'opened_date',
      'total_interest',
      'last_capitalization',
      'total_earnings'
    ];

    this.bodyEditor = null;

    this.state = {
      data: this.messageToFormData(props.message)
    };
  }

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
    const rootClass = classNames('message-form', {
      'hide-editor-btns': !this.htmlTypes.includes(this.state.data.type)
    });

    return <form className={rootClass} onSubmit={this.submit}>
      {this.renderDetails()}
      {this.renderConditions()}
      {this.renderAudienceSelection()}
      <div className="form-group text-right">
        <button className="button">{this.submitButtonText[this.props.mode]}</button>
      </div>
    </form>;
  }

  renderDetails() {
    const { state } = this;
    const action = this.getActionProperties(state.data.quickAction);
    return <>
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">Message details</div>
      </div>
      {/* Title */}
      <div className="form-group">
        <div className="form-label">Title</div>
        <Input placeholder="Enter title" name="title" disabled={this.isView()}
          value={state.data.title} onChange={this.inputChange}/>
      </div>
      {/* Body */}
      <div className="form-group">
        <div className="form-label">Body</div>
        <TextEditor init={{ setup: this.setupBodyEditor }} value={state.data.body} disabled={this.isView()}
          onEditorChange={value => this.inputChange({ target: { name: 'body', value }})}/>
      </div>
      <div className="grid-row">
        {/* Quick action */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Quick action from message</div>
            <Select placeholder="Select action" name="quickAction" disabled={this.isView()}
              value={state.data.quickAction} onChange={this.inputChange}>
              <option value="VIEW_HISTORY">View history</option>
              <option value="ADD_CASH">Add cash</option>
              <option value="VISIT_WEB">Visit website</option>
            </Select>
          </div>
        </div>
        {/* Parameter for action */}
        {this.hasActionParameters(state.data.quickAction) && <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">{action.label}</div>
            <Input placeholder={action.placeholder} name={action.name} disabled={this.isView()}
              value={state.data[action.name]} onChange={this.inputChange}/>
          </div>
        </div>}
      </div>
    </>;
  }

  renderConditions() {
    const { state } = this;
    return <>
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Specify conditions</div>
      </div>
      <div className="grid-row">
        {/* Type */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Set display type</div>
            <Select name="type" disabled={this.isView()}
              value={state.data.type} onChange={this.inputChange}>
              {this.typeOptions.map(item => 
                <option key={item.value} value={item.value}>{item.text}</option>)}
            </Select>
          </div>
        </div>
        {/* Send message */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Send message</div>
            <DatePicker selected={state.data.sendDate} disabled={this.isView()}
               onChange={value => this.inputChange({ target: { name: 'sendDate', value } })}/>
          </div>
        </div>
        {/* Priority */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Assign a priority (0=low, 100=high)</div>
            <Input type="number" name="priority" disabled={this.isView()}
              value={state.data.priority} onChange={this.inputChange}/>
          </div>
        </div>
      </div>
      <div className="grid-row">
        {/* Send message (recurrence) */}
        <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">Send message</div>
            <Select name="recurrence" disabled={this.isView()}
              value={state.data.recurrence} onChange={this.inputChange}>
              <option value="ONCE_OFF">Only now</option>
              <option value="RECURRING">Repeatedly</option>
              <option value="EVENT_DRIVEN">When some event occurs</option>
            </Select>
          </div>
        </div>
        {state.data.recurrence === 'RECURRING' && <>
          {/* Recurring min interval days */}
          <div className="grid-col-4">
            <div className="form-group">
              <div className="form-label">Assign minimum days between sending messages</div>
              <Input type="number" name="recurringMinIntervalDays" disabled={this.isView()}
                value={state.data.recurringMinIntervalDays} onChange={this.inputChange}/>
            </div>
          </div>
          {/* Recurring max in queue */}
          <div className="grid-col-4">
            <div className="form-group">
              <div className="form-label">Skip sending if more than X messages have been sent</div>
              <Input type="number" name="recurringMaxInQueue" disabled={this.isView()}
                value={state.data.recurringMaxInQueue} onChange={this.inputChange} />
            </div>
          </div>
        </>}
        {state.data.recurrence === 'EVENT_DRIVEN' && <div className="grid-col-4">
          {/* Event type and category */}
          <div className="form-group">
            <div className="form-label">Event type and category</div>
            <Input name="eventTypeCategory" disabled={this.isView()}
              value={state.data.eventTypeCategory} onChange={this.inputChange}/>
          </div>
        </div>}
      </div>
    </>;
  }

  renderAudienceSelection() {
    const clients = this.props.clients;
    return /(new|duplicate)/.test(this.props.mode) ?
      <AudienceSelection headerNum="3"
        clientId={clients[0] ? clients[0].clientId : null}
        ref={ref => this.audienceRef = ref}/> : null;
  }

  inputChange = event => {
    const { name, value } = event.target;
    const state = this.state;

    const newState = {
      data: { ...state.data, [name]: value }
    };

    // Convert body to text if "html" type changed to "text" type
    if (
      name === 'type' && this.htmlTypes.includes(state.data.type) && !this.htmlTypes.includes(value)
    ) {
      newState.data.body = this.bodyEditor.getContent({ format: 'text' });
    }

    this.setState(newState);
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
        sendDate: new Date(),
        recurrence: 'ONCE_OFF',
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
      sendDate: null,
      recurrence: message.presentationType,
      recurringMinIntervalDays: recurrenceParameters ? recurrenceParameters.minIntervalDays : 0,
      recurringMaxInQueue: recurrenceParameters ? recurrenceParameters.maxInQueue : 0,
      eventTypeCategory: (message.flags && message.flags[0]) ? message.flags[0] : '',
      urlToVisit: defaultTemplate.urlToVisit
    };
  }

  getMessageReqBody() {
    const data = this.state.data;

    const msgBody = this.bodyEditor.getContent({
      format: this.htmlTypes.includes(data.type) ? 'html' : 'text'
    });

    const body = {
      audienceType: 'GROUP',
      templates: {
        template: {
          DEFAULT: {
            title: data.title,
            body: msgBody,
            display: { type: data.type },
            actionToTake: data.quickAction
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
        body.eventTypeCategory = data.eventTypeCategory;
      }
    }
    
    if (this.hasActionParameters(data.quickAction)) {
      const action = this.getActionProperties(data.quickAction);
      body.templates.template.DEFAULT.actionContext = { [action.name]: data[action.name] }
    }

    return body;
  }

  getAudienceReqBody() {
    return this.audienceRef ? this.audienceRef.getReqBody() : null;
  }

  getActionProperties(action) {
    const propertyMap = {
      ADD_CASH: {
        name: 'addCashPreFilled',
        label: 'Default amount',
        placeholder: 'Enter default amount'
      },
      VISIT_WEB: {
        name: 'urlToVisit',
        label: 'Url to visit',
        placeholder: 'Enter website url'
      }
    }
    return propertyMap[action];
  }

  hasActionParameters(action) {
    return ['ADD_CASH', 'VISIT_WEB'].includes(action);
  };

  reset() {
    this.setState({ data: this.messageToFormData(null) });
    this.audienceRef && this.audienceRef.reset();
  }

  setupBodyEditor = editor => {
    editor.settings.toolbar += ' | params';
    editor.ui.registry.addMenuButton('params', {
      text: 'Insert parameter',
      fetch: cb => {
        const items = this.bodyParameters.map(param => {
          return {
            type: 'menuitem', text: param,
            onAction: () => editor.selection.setContent(`#{${param}}`)
          }
        });
        cb(items);
      }
    });
    this.bodyEditor = editor;
  }
}

export default MessageForm;
