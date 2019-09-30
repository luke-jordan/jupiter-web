import React from 'react';

import './HomePage.scss';

class HomePage extends React.Component {
  render() {
    return <div className="home-page">
      <div className="stats">
        <div className="card">
          <div className="card-body">
            Total users
          </div>
        </div>

        <div className="card widget">
          <div className="card-header">
            <div className="header-left">Today</div>
            <div className="header-right">14 July 2019</div>
          </div>
          <div className="card-body">...</div>
        </div>
        
        <div className="card widget">
          <div className="card-header">
            <div className="header-left">Yesterday</div>
            <div className="header-right">13 July 2019</div>
          </div>
          <div className="card-body">...</div>
        </div>
      </div>
    </div>;
  }
}

export default HomePage;