import React from 'react';
import classNames from 'classnames';

import './Input.scss';

const Input = props => {
  const rootClass = classNames('base-input input', {
    disabled: props.disabled,
    attention: props.attention,
    error: props.error
  }, props.className);
  
  return <div className={rootClass}>
    <input className="input-control"
      type={props.type}
      name={props.name}
      disabled={props.disabled}
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      value={props.value}
      autoComplete={props.autoComplete}
      onChange={props.onChange}
      min={props.min}
      max={props.max}/>
    {props.error && <div className="input-error">{props.error}</div>}
  </div>;
};

Input.defaultProps = {
  type: 'text',
  maxLength: 1000
};

export default Input;