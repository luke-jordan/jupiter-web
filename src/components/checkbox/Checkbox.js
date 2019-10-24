import React from 'react';
import classNames from 'classnames';

import './Checkbox.scss';
import checkBoxImg from 'src/assets/images/check-box.svg';

const Checkbox = props => {
  const rootClass = classNames('base-input checkbox', { disabled: props.disabled });

  return <div className={rootClass}>
    <label className="checkbox-inner" htmlFor={props.name}>
      <input type="checkbox"
        disabled={props.disabled}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}/>
      <div className="checkbox-icon">
        <img className="checkbox-img" src={checkBoxImg} alt="checkbox"/>
      </div>
      {props.children && <div className="checkbox-text">{props.children}</div>}
    </label>
    {props.error && <div className="input-error">{props.error}</div>}
  </div>;
}

export default Checkbox;