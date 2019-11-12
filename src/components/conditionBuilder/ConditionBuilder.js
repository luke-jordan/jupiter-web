import React from 'react';

import ConditionGroup from './ConditionGroup';

import './ConditionBuilder.scss';

class ConditionBuilder extends React.Component {
  defaultPropValue = {
    string: '',
    number: '',
    boolean: true,
    epochMillis: null
  };

  constructor(props) {
    super();

    this.state = {
      root: props.root
    };
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
        event.item.children.push({ value: '', op: 'is', ...this.getDefPropAndValue() });
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
        event.item.value = '';
        this.normalizeItemOnPropChange(event.item);
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

  getDefPropAndValue() {
    const field = this.props.ruleFields[0];
    return field ? { prop: field.name, value: this.defaultPropValue[field.expects] } : {};
  }

  normalizeItemOnPropChange(item) {
    const field = this.props.ruleFields.find(_field => _field.name === item.prop);

    if (field.expects === 'boolean') {
      item.op = 'is';
      if (typeof item.value !== 'boolean') {
        item.value = true;
      }
      return;
    }

    if (['string', 'number'].includes(field.expects) && typeof item.value !== 'string') {
      item.value = '';
      return;
    }

    if (field.expects === 'epochMillis' && !(field.value instanceof Date)) {
      item.value = new Date();
    }
  }

  getCorrecteOperation(item) {
    const field = this.props.ruleFields.find(_field => _field.name === item.prop);
    return (field && field.expects === 'boolean') ? 'is' : item.op;
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