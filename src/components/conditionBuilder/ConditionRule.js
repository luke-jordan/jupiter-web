import React from 'react';

import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';

const ConditionRule = props => {
  const item = props.item;
  return <div className="condition-rule">
    <div className="grid-row">
      <div className="grid-col">
        <Select value={item.prop} onChange={console.log}>
          <option value="field_1">Field 1</option>
          <option value="field_2">Field 2</option>
          <option value="field_3">Field 3</option>
        </Select>
      </div>
      <div className="grid-col">
        <Select value={item.op} onChange={console.log}>
          <option value="is">equal</option>
          <option value="greater_than">greater than</option>
          <option value="less_than">less than</option>
        </Select>
      </div>
      <div className="grid-col">
        <Input value={item.value} onChange={console.log}/>
      </div>
      <div className="grid-col-1">
        <span className="link" onClick={console.log}>delete</span>
      </div>
    </div>
  </div>;
};

export default ConditionRule;