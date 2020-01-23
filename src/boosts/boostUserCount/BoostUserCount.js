import React from 'react';

import { capitalize } from 'src/core/utils';

import './BoostUserCount.scss';

const BoostUserCount = props => {
  const count = props.boost.count;
  const keys = Object.keys(count);
  return <div className="boost-user-count">
    <div className="count-inner">
      <div className="grid-row">
        {keys.map(key => <div className="grid-col"  key={key}>
          <div className="count-value">{count[key]}</div>
          <div className="count-title">{capitalize(key)}</div>
        </div>)}
      </div>
    </div>
  </div>
}

export default BoostUserCount;