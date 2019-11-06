import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'src/components/modal/Modal';

export class ModalService {
  openInfo(header, text) {
    this.openModal(
      <Modal className="info-modal" open header={header}
        onClose={() => this.closeModal()}>
        <div className="info-text">{text}</div>
        <button className="button" onClick={() => this.closeModal()}>Ok</button>
      </Modal>
    );
  }

  openCommonError() {
    this.openInfo('Error', 'An error has occurred. Please try again.');
  }

  openModal(modalElement) {
    if (!this._container) {
      this._container = document.createElement('div');
      document.body.appendChild(this._container);
    }

    ReactDOM.render(modalElement, this._container);
  }

  closeModal() {
    if (this._container) {
      ReactDOM.unmountComponentAtNode(this._container);
      document.body.removeChild(this._container);
      this._container = null;
    }
  }
}