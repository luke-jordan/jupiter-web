import React from 'react';

import ConditionGroup from './ConditionGroup';

import './ConditionBuilder.scss';

class ConditionBuilder extends React.Component {
  constructor() {
    super();

    this.state = {
      root: {
        type: 'aggregate',
        operation: 'and',
        children: [{
          type: 'match'
        }, {
          type: 'match'
        }, {
          type: 'aggregate',
          children: [{
            type: 'aggregate',
            children: [{
              type: 'aggregate',
              children: [{
                type: 'aggregate',
                children: [{
                  type: 'match'
                }]
              }]
            }]
          }]
        }]
      }
    };
  }

  render() {
    return <div className="condition-builder">
      <ConditionGroup item={this.state.root} onEvent={this.eventHandler} isRoot/>
    </div>;
  }

  eventHandler = (event, data) => {
    console.log(event);
  }
}

export default ConditionBuilder;