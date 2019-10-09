import React from 'react';
import classNames from 'classnames';

import './MessageForm.scss';

class MessageForm extends React.Component {
  render() {
    return <form className="message-form" onSubmit={this.props.onSubmit}>
      {this.renderLeft()}
      {this.renderRight()}
    </form>;
  }

  renderLeft() {
    const { formData, onChange } = this.props;
    const isView = this.props.mode === 'view';

    return <div className="msg-form-left">
      <div className="form-section">
        <div className="section-num">1</div>
        <div className="section-text">Enter message details</div>
      </div>
      <div className={classNames('msg-details', { 'view-mode': isView })}>
        {/* Title */}
        <div className="form-group">
          <div className="form-label">Title</div>
          <input className="form-input" type="text" placeholder="Enter title" name="title"
            value={formData.title} onChange={onChange} disabled={isView}/>
        </div>
        {/* Body */}
        <div className="form-group">
          <div className="form-label">Body</div>
          <textarea className="form-input" rows="15" placeholder="Enter body" name="body"
            value={formData.body} onChange={onChange} disabled={isView}/>
        </div>
        {/* Quick action */}
        <div className="form-group">
          <div className="form-label">Quick action from message</div>
          <select className="form-input" placeholder="Select action" name="quickAction"
            value={formData.quickAction} onChange={onChange} disabled={isView}>
            <option value="VIEW_HISTORY">View history</option>
            <option value="ADD_CASH">Add cash</option>
            <option value="VISIT_WEB">Visit website</option>
          </select>
        </div>
      </div>
    </div>;
  }

  renderRight() {
    const { formData, onChange } = this.props;
    const isView = this.props.mode === 'view';

    return <div className="msg-form-right">
      <div className="form-section">
        <div className="section-num">2</div>
        <div className="section-text">Specify conditions</div>
      </div>
      {/* Type */}
      <div className="form-group">
        <div className="form-label">Set display type</div>
        <select className="form-input" name="type"
          value={formData.type} onChange={onChange} disabled={isView}>
          <option value="CARD">Card</option>
          <option value="MODAL">Modal</option>
          <option value="PUSH">Push notification</option>
        </select>
      </div>
      {/* Send to */}
      <div className="form-group">
        <div className="form-label">Send to</div>
        <select className="form-input" name="sendTo"
          value={formData.sendTo} onChange={onChange} disabled={isView}>
          <option value="whole_universe">All users @ client</option>
          <option value="random_sample">Sample of client users</option>
        </select>
      </div>
      {/* Sample size */}
      {formData.sendTo === 'random_sample' && <div className="form-group">
        <div className="form-label">Sample size</div>
        <input className="form-input" type="number" name="sampleSize"
          value={formData.sampleSize} onChange={onChange} disabled={isView}/>
      </div>}
      {/* Priority */}
      <div className="form-group">
        <div className="form-label">Assign a priority (0=low, 100=high)</div>
        <input className="form-input" type="number" name="priority"
          value={formData.priority} onChange={onChange} disabled={isView}/>
      </div>
      {/* Send message (recurrence) */}
      <div className="form-group">
        <div className="form-label">Send message</div>
        <select className="form-input" name="recurrence" 
          value={formData.recurrence} onChange={onChange} disabled={isView}>
          <option value="ONCE_OFF">Only now</option>
          <option value="RECURRING">Repeatedly</option>
          <option value="EVENT_DRIVEN">When some event occurs</option>
        </select>
      </div>
      {formData.recurrence === 'RECURRING' && <>
        {/* Recurring min interval days */}
        <div className="form-group">
          <div className="form-label">Assign minimum days between sending messages</div>
          <input className="form-input" type="number" name="recurringMinIntervalDays"
            value={formData.recurringMinIntervalDays} onChange={onChange} disabled={isView}/>
        </div>
        {/* Recurring max in queue */}
        <div className="form-group">
          <div className="form-label">Skip sending if more than X messages have been sent</div>
          <input className="form-input" type="number" name="recurringMaxInQueue"
            value={formData.recurringMaxInQueue} onChange={onChange} disabled={isView}/>
        </div>
      </>}
      {/* Event type and category */}
      {formData.recurrence === 'EVENT_DRIVEN' && <div className="form-group">
        <div className="form-label">Event type and category</div>
        <input className="form-input" type="text" name="eventTypeCategory"
          value={formData.eventTypeCategory} onChange={onChange} disabled={isView}/>
      </div>}
      <div className="form-group text-right">
        <button className="button">{this.getSubmitText()}</button>
      </div>
    </div>;
  }

  getSubmitText() {
    return {
      'new': 'Submit',
      'view': 'Edit',
      'edit': 'Update',
      'duplicate': 'Submit'
    }[this.props.mode];
  }
}

export default MessageForm;
