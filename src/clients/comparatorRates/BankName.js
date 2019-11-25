import React from 'react';

import Input from 'src/components/input/Input';

const BankName = props => {
  const nameChange = e => {
    props.onChange({ ...props.bank, name: e.target.value });
  };

  return <div className="bank-name">
    <div className="grid-row">
      <div className="grid-col-10">
        <span className="bank-label">Name:</span>
        {props.edit ? <Input value={props.bank.name} placeholder="Bank name"
          onChange={nameChange}/> :
          <span className="bank-value">{props.bank.name}</span>}
      </div>
      <div className="grid-col-2 text-right">
        {props.edit && <span className="link text-underline"
          onClick={props.onRemove}>Remove bank</span>}
      </div>
    </div>
  </div>;
}

export default BankName;