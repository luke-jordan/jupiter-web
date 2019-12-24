import React from 'react';

import { capitalize } from 'src/core/utils';

import './BoostUserCount.scss';

const BoostUserCount = props => {
  const count = props.boost.count;
  const keys = Object.keys(count);
  return <table className="table boost-user-count">
    <thead>
      <tr>
        {keys.map(key => <th key={key}>{capitalize(key)}</th>)}
      </tr>
    </thead>
    <tbody>
      <tr>
        {keys.map(key => <td key={key}>{count[key]}</td>)}
      </tr>
    </tbody>
  </table>;
}

export default BoostUserCount;