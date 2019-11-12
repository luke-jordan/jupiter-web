import React from 'react';

import ConditionGroup from './ConditionGroup';

import './ConditionBuilder.scss';

class ConditionBuilder extends React.Component {
  constructor() {
    super();

    this.state = {
      root: {
        type: 'aggregate',
        op: 'and',
        children: []
      }
    };
  }

  render() {
    return <div className="condition-builder">
      <ConditionGroup item={this.state.root} onEvent={this.eventHandler}/>
    </div>;
  }

  eventHandler = event => {
    switch (event.action) {
      case 'group:add-rule':
        event.item.children.push({ type: 'match', value: '', op: 'is' });
        break;

      case 'group:add-group':
        event.item.children.push({ type: 'aggregation', op: 'or', children: [] });
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
  }
}

export default ConditionBuilder;