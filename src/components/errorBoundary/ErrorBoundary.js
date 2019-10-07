import React from 'react';

import './ErrorBoundary.scss';

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
        <div className="card">
          <div className="card-body">Error: {error.message}</div>
        </div>
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