import React from 'react';

import Tabs from 'src/components/tabs/Tabs';

import ConditionRule from './ConditionRule';

import closeImg from 'src/assets/images/close.svg';

class ConditionGroup extends React.Component {
  render() {
    const props = this.props;
    return <div className="condition-group">
      <div className="group-operator">
        <Tabs tabs={[
          { text: 'And', value: 'and' },
          { text: 'Or', value: 'or' }
        ]} activeTab={props.item.op} onChange={this.operatorChange}/>
      </div>
      <div className="group-actions">
        <button type="button" className="button button-small button-outline"
          onClick={this.addRuleClick}>+ Add rule</button>
        <button type="button" className="button button-small button-outline"
          onClick={this.addGroupClick}>+ Add group</button>
        {props.parent && <button type="button" onClick={this.deleteClick}
          className="button button-small button-outline delete-group">
          <img src={closeImg} alt="remove"/>
        </button>}
      </div>
      <div className="group-inner">
        {props.item.children.length ? 
          props.item.children.map(this.renderChild) : <div className="no-rules">no rules</div>}
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
      entities={props.entities}
      onEvent={props.onEvent}/>;
  }

  operatorChange = operator => {
    this.triggerAction('group:change-op', { newValue: operator });
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