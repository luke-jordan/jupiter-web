import React from 'react';

import ConditionGroup from './ConditionGroup';

import './ConditionBuilder.scss';

class ConditionBuilder extends React.Component {
  constructor(props) {
    super();

    this.state = {
      root: props.root
    };
  }

  render() {
    return <div className="condition-builder">
      <ConditionGroup item={this.state.root}
        ruleOptions={this.props.ruleOptions}
        onEvent={this.eventHandler}/>
    </div>;
  }

  eventHandler = event => {
    // Note that state modified directly because root object is complex and can contain arbitrary level of nested groups (children).
    // Force update is used to rerender all sub-components.

    switch (event.action) {
      case 'group:add-rule':
        event.item.children.push({ value: '', op: 'is', prop: this.getDefaultRuleOption() });
        break;

      case 'group:add-group':
        event.item.children.push({ children: [], op: 'and' });
        break;

      case 'group:change-op':
        event.item.op = event.newValue;
        break;

      case 'group:delete':
        event.parent.children.splice(event.parent.children.indexOf(event.item), 1);
        break;

      case 'rule:change-prop':
        event.item.prop = event.newValue;
        break;

      case 'rule:change-op':
        event.item.op = event.newValue;
        break;
      
      case 'rule:change-val':
        event.item.value = event.newValue;
        break;
        
      case 'rule:delete':
        event.parent.children.splice(event.parent.children.indexOf(event.item), 1);
        break;

      default:
        console.warn(`Unhandled action ${event.action}`);
        return;
    }

    this.forceUpdate();

    console.log(JSON.stringify(this.state.root, null, 2));
  }

  getDefaultRuleOption() {
    const firstOption = this.props.ruleOptions[0];
    return firstOption ? firstOption.name : undefined;
  }
}

ConditionBuilder.defaultProps = {
  root: { children: [], op: 'and' },
  ruleOptions: [{
    name: 'stringProp',
    type: 'aggregate',
    description: 'String property',
    expects: 'string'
  }, {
    name: 'numberProp',
    type: 'aggregate',
    description: 'Number property',
    expects: 'number'
  }, {
    name: 'booleanProperty',
    type: 'match',
    description: 'Boolean property',
    expects: 'boolean'
  }, {
    name: 'dateProp',
    type: 'match',
    description: 'Date property',
    expects: 'epochMillis'
  }]
};

export default ConditionBuilder;