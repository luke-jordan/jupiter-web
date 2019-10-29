import React from 'react';
import ReactDOM from 'react-dom';

import './Modal.scss';
import closeIcon from 'assets/images/close.svg';

class Modal extends React.Component {
  render() {
    const props = this.props;

    if (!props.open) {
      return null;
    }

    return ReactDOM.createPortal(
      <div className="modal" onClick={this.modalClick}>
        <div className="modal-content">
          <div className="modal-header">
            {props.header}
            <div className="modal-close-icon" onClick={props.onClose}>
              <img src={closeIcon} alt="close"/>
            </div>
          </div>
          <div className="modal-body">{props.children}</div>
        </div>
      </div>,
      document.body
    );
  }

  componentDidMount() {
    this.toggleBodyClass(this.props.open);
  }

  componentDidUpdate(prevProps) {
    if (this.props.open !== prevProps.open) {
      this.toggleBodyClass(this.props.open);
    }
  }

  componentWillUnmount() {
    this.toggleBodyClass(false);
  }

  toggleBodyClass(open) {
    document.body.classList.toggle('modal-open', open);
  }

  modalClick = event => {
    if (!event.target.closest('.modal-content') && this.props.onClose) {
      this.props.onClose(event);
    }
  }
}

export default Modal;