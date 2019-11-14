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

  componentDidUpdate(prevProps) {
    if (this.props.root !== prevProps.root) {
      this.setState({ root: this.props.root });
    }
  }

  render() {
    return <div className="condition-builder">
      <ConditionGroup item={this.state.root}
        ruleFields={this.props.ruleFields}
        onEvent={this.eventHandler}/>
    </div>;
  }

  eventHandler = event => {
    // Note that state modified directly because root object is complex and can contain arbitrary level of nested groups (children).
    // Force update is used to rerender changes.

    switch (event.action) {
      case 'group:add-rule':
        event.item.children.push(this.createNewRule());
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
        this.processItemOnPropChange(event.item);
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

    if (this.props.onChange) {
      this.props.onChange(this.state.root);
    }
  }

  getDefaultValue(inputType) {
    switch (inputType) {
      case 'string': return '';
      case 'number': return '0';
      case 'boolean': return true;
      case 'epochMillis': return Date.now();
      default: return '';
    }
  }

  createNewRule() {
    const field = this.props.ruleFields[0];
    return {
      op: 'is',
      value: this.getDefaultValue(field.expects),
      prop: field.name,
      type: field.type
    };
  }

  processItemOnPropChange(item) {
    const field = this.props.ruleFields.find(_field => _field.name === item.prop);
    item.value = this.getDefaultValue(field.expects);
    item.type = field.type;

    if (field.expects === 'boolean') {
      item.op = 'is';
    }
  }
}

ConditionBuilder.defaultProps = {
  root: {
    op: 'and',
    children: [{
      op: 'is',
      value: '123',
      prop: 'stringProp'
    }, {
      op: 'or',
      children: [{
        op: 'greater_than',
        value: '10',
        prop: 'numberProp'
      }]
    }]
  },
  ruleFields: [{
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