import React from 'react';

import './Checkbox.scss';

const Checkbox = props => {
  return <input type="checkbox" checked={props.checked}
    onChange={e => props.onChange(e.target.checked)} disabled={props.disabled}/>
};

export default Checkbox;