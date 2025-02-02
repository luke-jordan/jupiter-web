import React from 'react';
import moment from 'moment';

import Input from 'src/components/input/Input';
import Select from 'src/components/select/Select';
import DatePicker from 'src/components/datePicker/DatePicker';
import RadioButton from 'src/components/radioButton/RadioButton';

import closeImg from 'src/assets/images/close.svg';

class ConditionRule extends React.Component {
  render() {
    const props = this.props;
    const item = props.item;
    const itemField = this.getItemField();

    const isStringInput = ['string', 'stringMultiple'].includes(itemField.expects);
    const isEntityInput = itemField.expects === 'entity';

    const allowGreaterLesser = !(isStringInput || isEntityInput);

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
              disabled={itemField.expects === 'boolean'}>
            <option value="is">is</option>
            {isStringInput && <option value="in">is one of</option>}
            {allowGreaterLesser && <option value="greater_than">is more than</option>}
            {allowGreaterLesser && <option value="less_than">is less than</option>}
            {isEntityInput && <option value="exclude">is not</option>}
          </Select>
        </div>
        <div className="grid-col-2">
          {this.renderInput(itemField)}
        </div>
        {this.renderPeriod(itemField)}
      </div>
      <div className="delete-rule" onClick={this.deleteClick}>
        <img src={closeImg} alt="delete"/>
      </div>
    </div>;
  }

  renderInput(itemField) {
    const item = this.props.item;
    const inputType = itemField.expects;

    if (inputType === 'string' || inputType === 'stringMultiple') {
      return <Input value={item.value} onChange={e => this.inputChange(e, inputType)}/>;
    }

    // note : would prefer for amounts to include unit and currency, but for the moment backend will assume whole currency if none specified
    if (inputType === 'number' || inputType === 'amount') {
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
      return <DatePicker selected={item.value} showClear={false}
        onChange={e => this.inputChange(e, inputType)}/>;
    }

    if (inputType === 'entity') {
      const availableEntities = this.props.entities[itemField.entity] || [];
      return <Select value={item.value} onChange={e => this.inputChange(e, inputType)}>
        {availableEntities.map((entity) => (
          <option key={entity.entityId} value={entity.entityId}>{entity.entityLabel}</option>
        ))}
      </Select>
    }

    return null;
  }

  renderPeriod(itemField) {
    if (!itemField.period) {
      return null;
    }

    const item = this.props.item;
    let linkText = 'Select period';

    if (item.startTime || item.endTime) {
      const format = 'DD/MM/YYYY';
      const periodStart = item.startTime ? `Start time: ${moment(item.startTime).format(format)}` : '';
      const periodEnd = item.endTime ? `End time: ${moment(item.endTime).format(format)}` : '';
      
      if (periodStart && periodEnd) {
        linkText = `${periodStart} - ${periodEnd}`;
      } else if (periodStart) {
        linkText = periodStart;
      } else if (periodEnd) {
        linkText = periodEnd;
      }
    }

    return <div className="grid-col-5 rule-period" onClick={this.editPeriodClick}>
      <span className="link">{linkText}</span>
    </div>;
  }

  getItemField() {
    return this.props.ruleFields.find(field => field.name === this.props.item.prop);
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

  editPeriodClick = () => {
    this.triggerAction('rule:period-edit');
  }

  triggerAction = (action, params) => {
    const props = this.props;
    props.onEvent({ action, item: props.item, parent: props.parent, ...params });
  }
}

export default ConditionRule;