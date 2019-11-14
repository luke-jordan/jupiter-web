import React from 'react';

import Select from 'src/components/select/Select';

import ConditionRule from './ConditionRule';

class ConditionGroup extends React.Component {
  render() {
    const props = this.props;
    return <div className="condition-group">
      <div className="group-operation">
        <Select className="operation" value={props.item.op} onChange={this.operationChange}>
          <option value="and">and</option>
          <option value="or">or</option>
        </Select>
      </div>
      <div className="group-actions">
        <button type="button" className="button button-outline" onClick={this.addRuleClick}>
          add rule</button>
        <button type="button" className="button button-outline" onClick={this.addGroupClick}>
          add group</button>
        {props.parent && <button type="button" className="button button-outline" onClick={this.deleteClick}>
          delete</button>}
      </div>
      <div className="group-inner">
        {props.item.children.length ? 
          props.item.children.map(this.renderChild) : <div className="no-conditions">no conditions</div>}
      </div>
    </div>;
  }

  renderChild = (childItem, childIndex) => {
    const props = this.props;
    const Cmp = childItem.children ? ConditionGroup : ConditionRule;
    return <Cmp key={childIndex}
      item={childItem}
      parent={props.item}
      ruleFields={props.ruleFields}
      onEvent={props.onEvent}/>;
  }

  operationChange = event => {
    this.triggerAction('group:change-op', { newValue: event.target.value });
  }

  addRuleClick = () => {
    this.triggerAction('group:add-rule');
  }

  addGroupClick = () => {
    this.triggerAction('group:add-group');
  }

  deleteClick = () => {
    this.triggerAction('group:delete');
  }

  triggerAction = (action, params) => {
    const props = this.props;
    props.onEvent({ action, item: props.item, parent: props.parent, ...params });
  }
}

export default ConditionGroup;