import React from 'react';

import Select from 'src/components/select/Select';

import ConditionRule from './ConditionRule';

class ConditionGroup extends React.Component {
  render() {
    const props = this.props;
    return <div className="condition-group" ref={el => this.el = el}>
      <div className="group-operation">
        <Select className="operation" value={props.op}
          onChange={e => this.actionClick('group:change-op', { newOp: e.target.value })}>
          <option value="and">and</option>
          <option value="or">or</option>
        </Select>
      </div>
      <div className="group-actions">
        <button className="button button-outline"
          onClick={() => this.actionClick('group:add-rule')}>add rule</button>
        <button className="button button-outline"
          onClick={() => this.actionClick('group:add-group')}>add group</button>
        {!props.isRoot && <button className="button button-outline"
          onClick={() => this.actionClick('group:delete')}>delete</button>}
      </div>
      <div className="group-inner">
        {props.item.children.map(this.renderChild)}
      </div>
    </div>;
  }

  renderChild = (child, index) => {
    return child.type === 'match' ?
      <ConditionRule item={child} key={index} onEvent={this.props.onEvent}/> :
      <ConditionGroup item={child} key={index} onEvent={this.props.onEvent}/>;
  }

  actionClick = (action, extra) => {
    const props = this.props;
    props.onEvent(action, { group: props.item, ...extra });
  }
};

export default ConditionGroup;