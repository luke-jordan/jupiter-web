import React from 'react';
import classNames from 'classnames';

import './TextArea.scss';

class TextArea extends React.Component {
  constructor() {
    super();
    this.inputRef = React.createRef();
    this.counterRef = React.createRef();
  }
  render() {
    const props = this.props;
    const rootClass = classNames('base-input textarea', { disabled: props.disabled });
    const showCharsCounter = !props.disabled && props.maxLength && props.charsCounter;
    
    return <div className={rootClass}>
      <div className="input-control-wrap">
        <textarea className="input-control"
          name={props.name}
          disabled={props.disabled}
          maxLength={props.maxLength}
          rows={props.rows}
          placeholder={props.placeholder}
          value={props.value}
          onChange={this.onChange}
          ref={this.inputRef}/>
        {showCharsCounter && <div className="chars-counter" ref={this.counterRef}></div>}
      </div>
      {props.error && <div className="input-error">{props.error}</div>}
    </div>
  }

  onChange = event => {
    this.updateCharsCounter();
    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  componentDidMount() {
    this.updateCharsCounter();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.updateCharsCounter();
    }
  }

  updateCharsCounter() {
    const counterEl = this.counterRef.current;
    const inputEl = this.inputRef.current;

    if (counterEl && inputEl) {
      const maxLength = this.props.maxLength;
      const used = inputEl.value.length;
      this.counterRef.current.innerHTML = `<mark>${used ? `${maxLength - used} of ` : ''}${maxLength}</mark> characters left`;
    }
  }
}

TextArea.defaultProps = {
  maxLength: 1000,
  charsCounter: true
};

export default TextArea;