import React from 'react';
import classNames from 'classnames';

import { messageDisplayTypeMap } from 'src/core/constants';
import { mapToOptions } from 'src/core/utils';
import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import TextArea from 'src/components/textArea/TextArea';

import './MessageForm.scss';

class MessageForm extends React.Component {
  constructor() {
    super();
    this.typeOptions = mapToOptions(messageDisplayTypeMap);
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

  render() {
    return <form className="message-form" onSubmit={this.props.onSubmit}>
      <div className="grid-row">
        {this.renderDetails()}
        {this.renderConditions()}
      </div>
    </form>;
  }

  renderDetails() {
    const { formData, onChange, mode } = this.props;
    return <div className="grid-col msg-details">
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">{this.detailsHeaderText[mode]}</div>
      </div>
      <div className={classNames('details-box', { 'view-mode': this.isView() })}>
        {/* Title */}
        <div className="form-group">
          <div className="form-label">Title</div>
          <Input placeholder="Enter title" name="title" disabled={this.isView()}
            value={formData.title} onChange={onChange}/>
        </div>
        {/* Body */}
        <div className="form-group">
          <div className="form-label">Body</div>
          <TextArea rows="15" placeholder="Enter body" name="body"
            value={formData.body} onChange={onChange} disabled={this.isView()}/>
        </div>
        {/* Quick action */}
        <div className="form-group">
          <div className="form-label">Quick action from message</div>
          <Select placeholder="Select action" name="quickAction" disabled={this.isView()}
            value={formData.quickAction} onChange={onChange}>
            <option value="VIEW_HISTORY">View history</option>
            <option value="ADD_CASH">Add cash</option>
            <option value="VISIT_WEB">Visit website</option>
          </Select>
        </div>
        {/* Url to visit */}
        {formData.quickAction === 'VISIT_WEB' && <div className="form-group">
          <div className="form-label">Url to visit</div>
          <Input placeholder="Enter website url" name="urlToVisit" disabled={this.isView()}
            value={formData.urlToVisit} onChange={onChange}/>
        </div>}
      </div>
    </div>;
  }

  renderConditions() {
    const { formData, onChange, mode } = this.props;
    return <div className="grid-col msg-conditions">
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">{this.conditionsHeaderText[mode]}</div>
      </div>
      {/* Type */}
      <div className="form-group">
        <div className="form-label">Set display type</div>
        <Select name="type" disabled={this.isView()}
          value={formData.type} onChange={onChange}>
          {this.typeOptions.map(item => 
            <option key={item.value} value={item.value}>{item.text}</option>)}
        </Select>
      </div>
      {/* Send to */}
      <div className="form-group">
        <div className="form-label">Send to</div>
        <Select name="sendTo" disabled={this.isView()}
          value={formData.sendTo} onChange={onChange}>
          <option value="whole_universe">All users @ client</option>
          <option value="random_sample">Sample of client users</option>
        </Select>
      </div>
      {/* Sample size */}
      {formData.sendTo === 'random_sample' && <div className="form-group">
        <div className="form-label">Sample size</div>
        <Input type="number" name="sampleSize" disabled={this.isView()}
          value={formData.sampleSize} onChange={onChange}/>
      </div>}
      {/* Priority */}
      <div className="form-group">
        <div className="form-label">Assign a priority (0=low, 100=high)</div>
        <Input type="number" name="priority" disabled={this.isView()}
          value={formData.priority} onChange={onChange}/>
      </div>
      {/* Send message (recurrence) */}
      <div className="form-group">
        <div className="form-label">Send message</div>
        <Select name="recurrence" disabled={this.isView()}
          value={formData.recurrence} onChange={onChange}>
          <option value="ONCE_OFF">Only now</option>
          <option value="RECURRING">Repeatedly</option>
          <option value="EVENT_DRIVEN">When some event occurs</option>
        </Select>
      </div>
      {formData.recurrence === 'RECURRING' && <>
        {/* Recurring min interval days */}
        <div className="form-group">
          <div className="form-label">Assign minimum days between sending messages</div>
          <Input type="number" name="recurringMinIntervalDays" disabled={this.isView()}
            value={formData.recurringMinIntervalDays} onChange={onChange}/>
        </div>
        {/* Recurring max in queue */}
        <div className="form-group">
          <div className="form-label">Skip sending if more than X messages have been sent</div>
          <Input type="number" name="recurringMaxInQueue" disabled={this.isView()}
            value={formData.recurringMaxInQueue} onChange={onChange} />
        </div>
      </>}
      {/* Event type and category */}
      {formData.recurrence === 'EVENT_DRIVEN' && <div className="form-group">
        <div className="form-label">Event type and category</div>
        <Input name="eventTypeCategory" disabled={this.isView()}
          value={formData.eventTypeCategory} onChange={onChange}/>
      </div>}
      <div className="form-group text-right">
        <button className="button">{this.submitButtonText[mode]}</button>
      </div>
    </div>;
  }
}

export default MessageForm;
