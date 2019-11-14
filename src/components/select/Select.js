import React from 'react';
import classNames from 'classnames';

import './Select.scss';

class Select extends React.Component {
  constructor() {
    super();
    this.valueRef = React.createRef();
    this.selectRef = React.createRef();
  }

  render() {
    const props = this.props;
    const rootClass = classNames('base-input select', { disabled: props.disabled }, props.className);

    return <div className={rootClass}>
      <div className="input-control">
        <div className="select-value" ref={this.valueRef}></div>
        <div className="select-arrow"></div>
        <select value={props.value} onChange={props.onChange}
          name={props.name} disabled={props.disabled} ref={this.selectRef}>
          {props.children}
        </select>
      </div>
      {props.error && <div className="input-error">{props.error}</div>}
    </div>;
  }

  componentDidMount() {
    this.updateValue();
  }

  componentDidUpdate() {
    this.updateValue();
  }
  
  updateValue() {
    if (this.selectRef.current && this.valueRef.current) {
      const selected = this.selectRef.current.selectedOptions[0];
      this.valueRef.current.textContent = selected ? selected.textContent : '';
    }
  }
}

export default Select;