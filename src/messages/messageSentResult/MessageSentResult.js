import React from 'react';

import Modal from 'src/components/modal/Modal';

import './MessageSentResult.scss';
import checkCircleImg from 'src/assets/images/check-circle.svg';
import errorCircleImg from 'src/assets/images/error-circle.svg';

class MessageSentResult extends React.Component {
  render() {
    return this.props.success ?
      this.renderMessageSent() : this.renderMessageNotSent();
  }

  renderMessageSent() {
    return <Modal open
      className="message-sent-result"
      header="Message sent"
      onClose={() => this.triggerAction('go-to-home')}>
      <div className="result-icon">
        <img src={checkCircleImg} alt="sent"></img>
      </div>
      <div className="result-text">Congrats! Your message has been submitted and is on it’s way…</div>
      <div className="grid-row">
        <div className="grid-col">
          <button className="button button-outline"
            onClick={() => this.triggerAction('go-to-home')}>Back to home</button>
        </div>
        <div className="grid-col text-right">
          <button className="button"
            onClick={() => this.triggerAction('create-new')}>New message</button>
        </div>
      </div>
    </Modal>;
  }

  renderMessageNotSent() {
    return <Modal open
      className="message-sent-result"
      header="Message is not sent"
      onClose={() => this.triggerAction('close')}>
      <div className="result-icon">
        <img src={errorCircleImg} alt="not sent"></img>
      </div>
      <div className="result-text">Sorry, there seems to be an error. Please edit your message and try again.</div>
      <div className="grid-row">
        <div className="grid-col">
          <button className="button button-outline"
            onClick={() => this.triggerAction('go-to-home')}>Back to home</button>
        </div>
        <div className="grid-col text-right">
          <button className="button"
            onClick={() => this.triggerAction('close')}>Edit message</button>
        </div>
      </div>
    </Modal>;
  }

  triggerAction(name) {
    this.props.onAction(name);
  }
}

export default MessageSentResult;