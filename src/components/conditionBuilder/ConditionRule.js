import React from 'react';

import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';

class ConditionRule extends React.Component {
  render() {
    const props = this.props;
    const item = props.item;

    return <div className="condition-rule">
      <div className="grid-row">
        <div className="grid-col">
          <Select value={item.prop} onChange={this.propChange}>
            <option value="field_1">Field 1</option>
            <option value="field_2">Field 2</option>
            <option value="field_3">Field 3</option>
          </Select>
        </div>
        <div className="grid-col">
          <Select value={item.op} onChange={this.operationChange}>
            <option value="is">equal</option>
            <option value="greater_than">greater than</option>
            <option value="less_than">less than</option>
          </Select>
        </div>
        <div className="grid-col">
          <Input value={item.value} onChange={this.valueChange}/>
        </div>
        <div className="grid-col-1">
          <span className="link" onClick={this.deleteClick}>delete</span>
        </div>
      </div>
    </div>;
  }

  propChange = event => {
    this.triggerAction('rule:change-prop', { newValue: event.target.value });
  }

  operationChange = event => {
    this.triggerAction('rule:change-op', { newValue: event.target.value });
  }

  valueChange = event => {
    this.triggerAction('rule:change-val', { newValue: event.target.value });
  }

  deleteClick = () => {
    this.triggerAction('rule:delete');
  }

  triggerAction = (action, params) => {
    const props = this.props;
    props.onEvent({ action, item: props.item, parent: props.parent, ...params });
  }
}

export default ConditionRule;