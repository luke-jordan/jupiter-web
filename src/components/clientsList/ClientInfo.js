import React from 'react';
import { NavLink } from 'react-router-dom';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';

import './ClientInfo.scss';
import currencyImage from 'src/assets/images/currency.svg';
import arrowRightPurple2Image from 'src/assets/images/arrow-right-purple2.svg';
import arrowRightWhite from 'src/assets/images/arrow-right-white.svg';

class ClientInfo extends React.Component {
  render() {
    return <div className="card client-info">
      <div className="card-header">
        {this.renderClient()}
      </div>
      <div className="card-body">
        {this.renderFloats()}
      </div>
    </div>;
  }

  renderClient() {
    const client = this.props.client;
    return <>
      <div className="client-title">
        <div className="client-name">Client: <b>{client.clientName}</b></div>
        <div className="client-country">{client.countryName}</div>
      </div>
      <div className="client-timezone">
        <div className="timezone-label">Timezone</div>
        <div className="timezone-value">{client.timeZone}</div>
      </div>
    </>;
  }

  renderFloats() {
    return this.props.client.floats.map(float => {
      return <div className="float-item" key={float.floatId}>
        {this.renderFloatInfo(float)}
        {this.renderBalanceInfo(float)}
      </div>;
    });
  }

  renderFloatInfo(float) {
    const client = this.props.client;
    return <div className="float-info">
      <div className="float-icon">
        <img src={currencyImage} alt=""/>
      </div>
      <div className="float-title">
        <div className="float-name">Float: <b>{float.floatName}</b></div>
        <div className="float-timezone"><b>Timezone:</b> {float.floatTimeZone}</div>
      </div>
      <div className="float-alerts">
        <div className="alerts-count">0<div className="indicator"/></div>
        <NavLink className="view-alerts" to={`/clients/${client.clientId}/float/${float.floatId}/alerts`}>
          View Alerts <img src={arrowRightPurple2Image} alt="arrow"/>
        </NavLink>
      </div>
    </div>;
  }

  renderBalanceInfo(float) {
    const client = this.props.client;
    return <div className="balance-info">
      {/* Total float balance */}
      <div className="balance-details">
        <div className="balance-name">Total float balance</div>
        <div className="balance-value">{float.floatBalance.amountMoney}</div>
        <div className="balance-stats">
          <div className="stats-item">
            <div className="stats-item-name">Growth in last month</div>
            <div className="stats-item-value">{float.floatMonthGrowth.amountMoney}</div>
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
        <div className="balance-value">{float.bonusPoolBalance.amountMoney}</div>
        <div className="balance-stats">
          <div className="stats-item">
            <div className="stats-item-name">Inflow last week</div>
            <div className="stats-item-value">{float.bonusInflowSum.amountMoney}</div>
          </div>
          <div className="stats-item">
            <div className="stats-item-name">Outflow last week</div>
            <div className="stats-item-value">{float.bonusOutflow.amountMoney}</div>
          </div>
        </div>
      </div>

      <div className="balance-actions">
        <NavLink className="button" to={`/clients/${client.clientId}/float/${float.floatId}`}>
          Mange float <img className="button-icon" src={arrowRightWhite} alt="arrow"/>
        </NavLink>
      </div>
    </div>;
  }
};

export default errorBoundary(ClientInfo);