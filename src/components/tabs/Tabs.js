import React from 'react';
import classNames from 'classnames';

import './Tabs.scss';

const Tabs = props => {
  const tabClick = tab => {
    if (props.onChange) {
      props.onChange(tab.value);
    }
  }

  return <div className="tabs">
    {props.tabs.map(tab => {
      const tabClass = classNames('tab', { active: tab.value === props.activeTab });
      return <div className={tabClass} key={tab.value} onClick={() => tabClick(tab)}>
        {tab.text}
      </div>
    })}
  </div>;
};

export default Tabs;