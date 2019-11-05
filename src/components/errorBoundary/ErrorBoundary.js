import React from 'react';

import './ErrorBoundary.scss';
import alertErrorIcon from 'src/assets/images/alert-error.svg';

class ErrorBoundary extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidCatch(error) {
    this.setState({ error });
  }

  render() {
    const error = this.state.error;
    if (error) {
      return <div className="error-boundary">
        <div className="error-icon"><img src={alertErrorIcon} alt="error"/></div>
        <div className="error-text">{error.message}</div>
      </div>;
    } else {
      return this.props.children;
    }
  }
};

// HOC
export const errorBoundary = Component => {
  return props => <ErrorBoundary><Component {...props}/></ErrorBoundary>;
};

export default ErrorBoundary;