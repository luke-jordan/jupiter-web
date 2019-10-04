import React from 'react';

import './Spinner.scss';

const Spinner = props => {
  const spinner = <div className="spinner"></div>;
  return props.overlay ? <div className="spinner-overlay">{spinner}</div> : spinner;
}

export default Spinner;