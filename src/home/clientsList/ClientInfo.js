import React from 'react';
import { NavLink } from 'react-router-dom';

import './ClientInfo.scss';

class ClientInfo extends React.Component {
  render() {
    return <div className="card client-info">
      <div className="card-header">
        {this.renderClient()}
      </div>
      <div className="card-body">
        {this.renderFloat()}
        {this.renderBalance()}
      </div>
    </div>;
  }

  renderClient() {
    const client = this.props.client;
    return <>
      <div className="client-title">
        <div className="client-name">Client: <b>-</b></div>
        <div className="client-country">-</div>
      </div>
      <div className="client-timezone">
        <div className="timezone-label">Timezone</div>
        <div className="timezone-value">{client.defaultTimezone}</div>
      </div>
    </>;
  }

  renderFloat() {
    const client = this.props.client;
    return <div className="float-info">
      <div className="float-icon">
        <img src="images/currency.svg" alt=""/>
      </div>
      <div className="float-title">
        <div className="float-name">Float: <b>{client.currency}</b></div>
        <div className="float-timezone"><b>Timezone:</b> {client.defaultTimezone}</div>
      </div>
      <div className="float-alerts">
        <div className="alerts-count">0<div className="indicator"/></div>
        <NavLink className="view-alerts" to="/clients">
          View Alerts <img src="images/arrow-right-purple2.svg" alt="arrow"/>
        </NavLink>
      </div>
    </div>;
  }

  renderBalance() {
    return <div className="balance-info">
    {/* Total float balance */}
      <div className="balance-details">
        <div className="balance-name">Total float balance</div>
        <div className="balance-value">0</div>
        <div className="balance-stats">
          <div className="stats-item">
            <div className="stats-item-name">Growth in last month</div>
            <div className="stats-item-value">0</div>
          </div>
          <div className="stats-item">
            <div className="stats-item-name">Users in last month</div>
            <div className="stats-item-value">0</div>
          </div>
        </div>
      </div>

      <div className="balance-divider"></div>

      {/* Bonus pool balance */}
      <div className="balance-details">
        <div className="balance-name">Bonus pool balance</div>
        <div className="balance-value">0</div>
        <div className="balance-stats">
          <div className="stats-item">
            <div className="stats-item-name">Inflow last week</div>
            <div className="stats-item-value">0</div>
          </div>
          <div className="stats-item">
            <div className="stats-item-name">Outflow last week</div>
            <div className="stats-item-value">0</div>
          </div>
        </div>
      </div>

      <div className="balance-actions">
        <NavLink className="button" to="/clients">
          Mange float <img className="button-icon" src="images/arrow-right-white.svg" alt="arrow"/>
        </NavLink>
      </div>
    </div>;
  }
};

export default ClientInfo;