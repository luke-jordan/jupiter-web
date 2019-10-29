import React from 'react';
import ReactDOM from 'react-dom';

import Modal from 'src/components/modal/Modal';

export class ModalService {
  constructor() {
    this._el = null;
  }

  showInfo(header, content) {
    if (!this._el) {
      this._el = document.createElement('div');
      document.body.appendChild(this._el);
    }

    ReactDOM.render(
      <Modal open header={header} onClose={() => this.hideModal()}>
        <div className="text-center">
          {content}
          <br/><br/>
          <button className="button" onClick={() => this.hideModal()}>Ok</button>
        </div>
      </Modal>,
      this._el
    );
  }

  hideModal() {
    if (this._el) {
      ReactDOM.unmountComponentAtNode(this._el);
      document.body.removeChild(this._el);
      this._el = null;
    }
  }
}