import React from 'react';

import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import DatePicker from 'src/components/datePicker/DatePicker';
import RadioButton from 'src/components/radioButton/RadioButton';

import closeImg from 'src/assets/images/close.svg';

class ConditionRule extends React.Component {
  render() {
    const props = this.props;
    const item = props.item;

    const inputType = this.getInputType();

    return <div className="condition-rule">
      <div className="grid-row">
        <div className="grid-col-3">
          <Select value={item.prop} onChange={this.propChange}>
            {props.ruleFields.map(field => {
              return <option key={field.name} value={field.name}>{field.description}</option>;
            })}
          </Select>
        </div>
        <div className="grid-col-2">
          <Select value={item.op} onChange={this.operatorChange}
            disabled={inputType === 'boolean'}>
            <option value="is">is</option>
            <option value="greater_than">is more than</option>
            <option value="less_than">is less than</option>
          </Select>
        </div>
        <div className="grid-col-2">
          {this.renderInput(inputType)}
        </div>
      </div>
      <div className="delete-rule" onClick={this.deleteClick}>
        <img src={closeImg} alt="delete"/>
      </div>
    </div>;
  }

  renderInput(inputType) {
    const item = this.props.item;

    if (inputType === 'string') {
      return <Input value={item.value} onChange={e => this.inputChange(e, inputType)}/>;
    }

    if (inputType === 'number') {
      return <Input type="number" value={item.value} onChange={e => this.inputChange(e, inputType)}/>;
    }

    if (inputType === 'boolean') {
      return <>
        <RadioButton value="yes" checked={item.value}
          onChange={e => this.inputChange(e, inputType)}>yes</RadioButton>
        <RadioButton value="no" checked={!item.value}
          onChange={e => this.inputChange(e, inputType)}>no</RadioButton>
      </>;
    }

    if (inputType === 'epochMillis') {
      return <DatePicker selected={item.value} allowClear={false}
        onChange={e => this.inputChange(e, inputType)}/>;
    }

    return null;
  }

  getInputType() {
    const field = this.props.ruleFields.find(field => field.name === this.props.item.prop);
    return field ? field.expects : null;
  }

  propChange = event => {
    this.triggerAction('rule:change-prop', { newValue: event.target.value });
  }

  operatorChange = event => {
    this.triggerAction('rule:change-op', { newValue: event.target.value });
  }

  inputChange = (event, inputType) => {
    let newValue;

    if (inputType === 'epochMillis') {
      newValue = event ? event.getTime() : null;
    } else if (inputType === 'boolean') {
      newValue = event.target.value === 'yes';
    } else {
      newValue = event.target.value;
    }

    this.triggerAction('rule:change-val', { newValue });
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