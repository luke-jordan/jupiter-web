import React from 'react';
import { takeUntil } from 'rxjs/operators';
import { NavLink } from 'react-router-dom';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import FloatAllocationTable from '../floatAllocationTable/FloatAllocationTable';
import FloatReferralCodesTable from '../floatReferralCodesTable/FloatReferralCodesTable';
import FloatBalanceEdit from '../floatBalanceEdit/FloatBalanceEdit';

import './ClientFloatPage.scss';
import currencyIcon from 'src/assets/images/currency.svg';
import arrowRightPurple2Image from 'src/assets/images/arrow-right-purple2.svg';

class ClientFloatPage extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');
    this.modalService = inject('ModalService');

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
        <FloatAllocationTable float={state.float} onSave={this.saveFloatAllocation}/>
        <FloatReferralCodesTable float={state.float} onAction={this.referralCodeAction}/>
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
      <FloatBalanceEdit balance={this.state.float.floatBalance}
        onClose={() => this.toggleBalanceEdit(false)}
        onChange={this.changeBalance}/> : null;
  }

  loadFloat() {
    this.setState({ loading: true });

    const { clientId, floatId } = this.props.match.params;

    this.clientsService.getFloat(clientId, floatId).pipe(
      takeUntil(this.unmount)
    ).subscribe(float => {
      this.setState({ loading: false, float });
    });
  }

  saveFloatAllocation = data => {
    this.setState({ loading: true });

    const { clientId, floatId } = this.props.match.params;
    
    this.clientsService.updateFloatAccrual(clientId, floatId, data.changes, data.reason).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({
        loading: false,
        float: Object.assign({}, this.state.float, data.changes)
      });
    });
  }

  referralCodeAction = (action, item) => {
    // TODO: Refferal codes management (api needed)
    console.log(action, item);

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false });
      this.modalService.showInfo('Info', 'Referral codes API is not implemented yet');
    }, 500);
  }

  toggleBalanceEdit(balanceEdit) {
    this.setState({ balanceEdit });
  }

  changeBalance = amount => {
    this.setState({ loading: true, balanceEdit: false });

    const float = this.state.float;
    this.clientsService.updateFloatBalance({
      clientId: float.clientId,
      floatId: float.floatId,
      amount: amount * 100,
      unit: 'WHOLE_CENT',
      currency: float.floatBalance.currency
    }).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => this.loadFloat());
  }
}

export default ClientFloatPage;