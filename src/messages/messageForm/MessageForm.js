import React from 'react';
import classNames from 'classnames';
import moment from 'moment';

import { messageDisplayTypeMap } from 'src/core/constants';
import { mapToOptions, inject } from 'src/core/utils';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import DatePicker from 'src/components/datePicker/DatePicker';
import Checkbox from 'src/components/checkbox/Checkbox';
import AudienceSelection from 'src/components/audienceSelection/AudienceSelection';
import TextEditor from 'src/components/textEditor/TextEditor';
import MessageEvents from '../messageSentResult/MessageEvents';

// import Modal from 'src/components/modal/Modal';

import './MessageForm.scss';

class MessageForm extends React.Component {
  constructor(props) {
    super();

    this.modalService = inject('ModalService');
    this.typeOptions = mapToOptions(messageDisplayTypeMap);

    this.htmlTypes = ['EMAIL', 'MODAL'];

    this.bodyParameters = [
      'user_first_name',
      'user_full_name',
      'current_balance',
      'opened_date',
      'total_interest',
      'last_capitalization',
      'total_earnings',
      'last_saved_amount'
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
      {this.renderParameters()}
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
        <Input placeholder="Enter title" name="title" maxLength="100" disabled={this.isView()}
          value={state.data.title} onChange={this.inputChange}/>
        {this.state.hasErrors && this.state.errors.title && 
          (<p className="input-error">{this.state.errors.title}</p>)}

      </div>
      {/* Body */}
      <div className="form-group">
        <div className="form-label">Body</div>
        <TextEditor init={{ setup: this.setupBodyEditor }} value={state.data.body} disabled={this.isView()}
          onEditorChange={value => this.inputChange({ target: { name: 'body', value }})}/>
      </div>
      {/* smsBackup */}
      {this.state.data.type === 'EMAIL' &&
        <div className="form-group">
          <div className="form-label">SMS backup</div>
          <Input placeholder="SMS for users without email addresses (leave blank to not send)" name="smsBackup"
            value={state.data.smsBackup} onChange={this.inputChange} />
        </div>
      }
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
              <option value="VIEW_BOOSTS">View boosts</option>
            </Select>
          </div>
        </div>
        {/* Parameter for action */}
        {this.hasActionParameters(state.data.quickAction) && <div className="grid-col-4">
          <div className="form-group">
            <div className="form-label">{action.label}</div>
            <Input placeholder={action.placeholder} name={action.name} disabled={this.isView()}
              value={state.data[action.name]} onChange={this.inputChange}/>
            {this.state.hasErrors && this.state.errors.actionContext && 
              (<p className="input-error">{this.state.errors.actionContext}</p>)}
          </div>
        </div>}
      </div>
    </>;
  }

  renderParameters() {
    const { state } = this;

    return <>
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Specify message parameters</div>
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
        {state.data.type === 'CARD' && <>
          {/* Card title style */}
          <div className="grid-col-4">
            <div className="form-group">
              <div className="form-label">Card title style</div>
                <Select name="titleType" disabled={this.isView()}
                  value={state.data.titleType} onChange={this.inputChange}>
                  <option value="NORMAL">Normal</option>
                  <option value="EMPHASIS">Emphasis</option>
              </Select>
            </div>
          </div>
          {/* Card icon style */}
          <div className="grid-col-4">
            <div className="form-group">
              <div className="form-label">Card icon</div>
              <Select name="iconType" disabled={this.isView()}
                value={state.data.iconType} onChange={this.inputChange}>
                <option value="NORMAL">Normal</option>
                <option value="BOOST_ROCKET">Boost rocket</option>
                <option value="UNLOCKED">Unlocked</option>
              </Select>
            </div>
          </div>
        </>}
      </div>
      <div className="grid-row">
      {/* Priority */}
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">Assign a priority (0=low, 100=high)</div>
          <Input type="number" name="priority" disabled={this.isView()}
            value={state.data.priority} onChange={this.inputChange}/>
        </div>
      </div>
      {/* Expiry date */}
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">Message expiry (time)</div>
          <DatePicker 
            selected={state.data.endDate} 
            disabled={this.isView() || state.data.noExpiry}
            showTimeSelect={true}
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            onChange={value => this.inputChange({ target: { name: 'endDate', value } })}/>
          <Checkbox name="noExpiry" checked={state.data.noExpiry} className="expiry-checkbox" 
            onChange={event => this.inputChange({ target: { name: 'noExpiry', value: event.target.checked }})}>
            Do not expire</Checkbox>
        </div>
      </div>
      </div>
      <div className="grid-row">
      {/* Send message (recurrence) */}
      <div className="grid-col-3">
        <div className="form-group">
          <div className="form-label">Send message</div>
          <Select name="recurrence" disabled={this.isView()}
            value={state.data.recurrence} onChange={this.inputChange}>
            <option value="ONCE_OFF">Only now</option>
            <option value="SCHEDULED">Once in the future</option>
            <option value="RECURRING">Repeatedly</option>
            <option value="EVENT_DRIVEN">When some event occurs</option>
          </Select>
        </div>
        </div>
        {state.data.recurrence === 'SCHEDULED' &&
          <div className="grid-col-3">
            <div className="form-group">
              <div className="form-label">When to send</div>
              <DatePicker
                name="sendDate"
                selected={state.data.sendDate}
                disabled={this.isView()}
                showTimeSelect={true}
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                onChange={value => this.inputChange({ target: { name: 'sendDate', value }})} />
            </div>
          </div>
        }
        {state.data.recurrence === 'EVENT_DRIVEN' && <>
          {/* Event type and category */}
          <div className="grid-col-3">
            <div className="form-group">
              <div className="form-label">Event that triggers message</div>
              <Input name="eventTypeCategory" disabled={this.isView()}
                value={state.data.eventTypeCategory} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col-3">
            <div className="form-group">
              <div className="form-label">Event that halts message (optional)</div>
              <Input name="haltingEvent" disabled={this.isView()}
                value={state.data.haltingEvent} onChange={this.inputChange}/>
            </div>
          </div>
          <div className="grid-col-3">
            <div className="form-group">
              <div className="form-label">Hours after message (optional)</div>
              <Input name="triggerTimeDelay" type="number" disabled={this.isView()}
                value={state.data.triggerTimeDelay} onChange={this.inputChange}/>
            </div>
          </div>
        </>}
      {state.data.recurrence === 'RECURRING' && <>
      {/* Recurring min interval days */}
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">Minimum days between resending</div>
          <Input type="number" name="recurringMinIntervalDays" disabled={this.isView()}
            value={state.data.recurringMinIntervalDays} onChange={this.inputChange}/>
        </div>
      </div>
      {/* Recurring max in queue */}
      <div className="grid-col-4">
        <div className="form-group">
          <div className="form-label">Skip if more than X msgs for user</div>
          <Input type="number" name="recurringMaxInQueue" disabled={this.isView()}
            value={state.data.recurringMaxInQueue} onChange={this.inputChange} />
        </div>
      </div>
      </>}
    </div>
    <div>
      <button className="link text-underline" onClick={this.renderModal}>Available Events</button>
    </div>
    </>;
  }

  renderModal() {
    // const { state } = this;
    return <MessageEvents/>;
  }

  // renderEventsTable() {
  //   // const state = this.state;

  //   // const rows = this.itemsConfig.map(item => {
  //   //   return <tr key={item.name}>
  //   //     <td>{item.title}</td>
  //   //     <td>
  //   //       {state.edit ?
  //   //         <><Input type="number" name={item.name}
  //   //             value={state.data[item.name]} onChange={this.inputChange}/> {item.unit}</> :
  //   //         `${state.data[item.name]}${item.unit}`}
  //   //     </td>
  //   //   </tr>;
  //   // });

  //   // const className = classNames('table', { edit: state.edit });

  //   return <table className='table'>
  //     <thead>
  //       <tr>
  //         <th>Name</th>
  //         <th style={{width: 200}}>Value</th>
  //       </tr>
  //     </thead>
  //     <tbody>{[<tr key='test-key'>
  //       <td>{'TIESTO'}</td>
  //       <td>
  //         {`test Test`}
  //       </td>
  //     </tr>]}</tbody>
  //   </table>;
  // }

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

  isValid() {
    const { data } = this.state;
    
    const errors = {};

    if (!data.title) {
      errors.title = 'Remember to set a title';
    }

    // console.log('Checking validity of data quick action: ', data.quickAction, 'and url: ', data.urlToVisit);
    if (data.quickAction === 'VISIT_WEB' && !data.urlToVisit.startsWith('https://')) {
      errors.actionContext = 'URLs must start with https://';
    }

    // console.log('Finished error checking: ', JSON.stringify(errors));
    if (Object.keys(errors).length === 0) {
      console.log('No errors, returning true');
      this.setState({ hasErrors: false });
      return true;
    }

    this.setState({ errors, hasErrors: true });
  }

  submit = event => {
    event.preventDefault();
    if (!this.isValid()) {
      return;
    }

    if (this.audienceRef && !this.audienceRef.isValid()) {
      this.audienceRef.showInvalidMessage();
      return;
    }

    // this.getMessageReqBody();
    this.props.onSubmit(this.getMessageReqBody(), this.getAudienceReqBody());
  }


  messageToFormData(message) {
    if (!message) {
      return {
        title: '',
        body: '',
        quickAction: 'ADD_CASH',
        type: 'CARD',
        priority: 10,
        endDate: moment().endOf('day').toDate(),
        sendDate: moment().toDate(),
        recurrence: 'ONCE_OFF',
        recurringMinIntervalDays: 0,
        recurringMaxInQueue: 0,
        eventTypeCategory: '',
        urlToVisit: '',
        noExpiry: true,
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
      endDate: null,
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

    const formalRecurrence = data.recurrence === 'SCHEDULED' ? 'ONCE_OFF' : data.recurrence;

    const msgDisplay = { type: data.type };
    
    if (data.titleType) {
      msgDisplay.titleType = data.titleType;
    }

    if (data.iconType) {
      msgDisplay.iconType = data.iconType;
    }

    if (data.type === 'EMAIL' && typeof data.smsBackup === 'string' && data.smsBackup.length > 0) {
      msgDisplay.backupSms = data.smsBackup;
    }

    const msgTemplate = {
      title: data.title,
      body: msgBody,
      display: msgDisplay,
      actionToTake: data.quickAction
    };

    const body = {
      audienceType: 'GROUP',
      templates: {
        template: {
          DEFAULT: msgTemplate
        }
      },
      messagePriority: parseInt(data.priority),
      presentationType: formalRecurrence
    };

    if (!data.noExpiry) {
      body.endTime = moment(data.endDate).format();
    }

    if (data.recurrence === 'SCHEDULED') {
      body.holdFire = true;
      body.startTime = moment(data.sendDate).format();
    }

    if (data.recurrence === 'RECURRING') {
      body.recurrenceParameters = {
        minIntervalDays: data.recurringMinIntervalDays,
        maxInQueue: data.recurringMaxInQueue
      };
    } else if (data.recurrence === 'EVENT_DRIVEN') {
      body.eventTypeCategory = data.eventTypeCategory;
      const triggerParameters = {
        triggerEvent: [data.eventTypeCategory]
      }

      if (data.haltingEvent.trim().length > 0) {
        triggerParameters.haltingEvent = [data.haltingEvent];
      }

      if (data.triggerTimeDelay && data.triggerTimeDelay > 0) {
        triggerParameters.messageSchedule = {
          type: 'RELATIVE',
          offset: { unit: 'hours', number: parseInt(data.triggerTimeDelay, 10) }
        }
      }

      body.triggerParameters = triggerParameters;
    }
    
    if (this.hasActionParameters(data.quickAction)) {
      const action = this.getActionProperties(data.quickAction);
      body.templates.template.DEFAULT.actionContext = { [action.name]: data[action.name] }
    }

    console.log('Created request body: ', body);

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
