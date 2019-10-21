import React from 'react';
import classNames from 'classnames';

import './RadioButton.scss';

const RadioButton = props => {
  const rootClass = classNames('base-input radio', { disabled: props.disabled });

  return <div className={rootClass}>
    <label className="radio-inner">
      <input type="radio"
        value={props.value}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}>
      </input>
      <div className="radio-icon"></div>
      {props.children && <div className="radio-text">{props.children}</div>}
    </label>
    {props.error && <div className="input-error">{props.error}</div>}
  </div>
};

export default RadioButton;