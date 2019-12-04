import React from 'react';
import { takeUntil } from 'rxjs/operators';
import { NavLink } from 'react-router-dom';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import FloatAllocationTable from '../floatAllocationTable/FloatAllocationTable';
import FloatReferralCodesTable from '../floatReferralCodesTable/FloatReferralCodesTable';
import FloatBalanceEdit from '../floatBalanceEdit/FloatBalanceEdit';
import ComparatorRates from '../comparatorRates/ComparatorRates'

import './ClientFloatPage.scss';
import currencyIcon from 'src/assets/images/currency.svg';
import arrowRightPurple2Image from 'src/assets/images/arrow-right-purple2.svg';

class ClientFloatPage extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      loading: false,
      float: null,
      balanceEdit: false
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadFloat();
  }

  render() {
    return <div className="client-float-page">
      <PageBreadcrumb title="Manage Float" link={{ to: '/clients', text: 'Clients' }}/>
      <div className="page-content">{this.renderContent()}</div>
      {this.renderBalanceEdit()}
    </div>;
  }

  renderContent() {
    const state = this.state;
    return <>
      {state.loading && <Spinner overlay/>}
      {state.float && <>
        {this.renderHeader()}
        <FloatAllocationTable float={state.float} onSaved={this.loadFloat}/>
        <FloatReferralCodesTable float={state.float} onChanged={this.referralCodesChanged}/>
        <ComparatorRates float={state.float} onSaved={this.loadFloat}/>
      </>}
    </>;
  }

  renderHeader() {
    const float = this.state.float;
    const alertsLink = `${this.props.location.pathname}/alerts`;

    return <div className="grid-row float-header">
      <div className="grid-col float-info">
        <img className="float-icon" src={currencyIcon} alt="currency"/>
        <div className="float-title">
          <div className="float-name">Float: <b>{float.floatName}</b></div>
          <NavLink className="link" to={alertsLink}>
            View Alerts <img src={arrowRightPurple2Image} alt="arrow"/>
          </NavLink>
        </div>
      </div>
      <div className="grid-col float-balance">
        <div className="balance-label">Total float balance</div>
        <div className="balance-value">{float.floatBalance.amountMoney}</div>
        <span className="link text-underline" onClick={() => this.toggleBalanceEdit(true)}>Change balance</span>
      </div>
    </div>;
  }

  renderBalanceEdit() {
    return this.state.balanceEdit ?
      <FloatBalanceEdit float={this.state.float}
        onClose={() => this.toggleBalanceEdit(false)}
        onCompleted={this.balanceChanged}/> : null;
  }

  loadFloat = () => {
    this.setState({ loading: true });

    const { clientId, floatId } = this.props.match.params;

    this.clientsService.getFloat(clientId, floatId).pipe(
      takeUntil(this.unmount)
    ).subscribe(float => {
      this.setState({ loading: false, float });
    });
  }

  toggleBalanceEdit(balanceEdit) {
    this.setState({ balanceEdit });
  }

  balanceChanged = () => {
    this.toggleBalanceEdit(false);
    this.loadFloat();
  }

  referralCodesChanged = referralCodes => {
    this.setState({
      float: { ...this.state.float, referralCodes }
    });
  }
}

export default ClientFloatPage;