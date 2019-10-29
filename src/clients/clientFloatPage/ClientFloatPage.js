import React from 'react';
import { takeUntil } from 'rxjs/operators';
import { NavLink } from 'react-router-dom';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import FloatAllocationTable from '../floatAllocationTable/FloatAllocationTable';
import FloatRefferalCodesTable from '../floatRefferalCodesTable/FloatRefferalCodesTable';

import './ClientFloatPage.scss';
import currencyIcon from 'src/assets/images/currency.svg';
import arrowRightPurple2Image from 'src/assets/images/arrow-right-purple2.svg';

class ClientFloatPage extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      loading: false,
      float: null
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
    </div>;
  }

  renderContent() {
    const state = this.state;

    if (state.loading) {
      return <div className="text-center"><Spinner/></div>;
    }

    if (state.float) {
      return <>
        {this.renderHeader()}
        <FloatAllocationTable float={state.float} onSave={this.floatSave}/>
        <FloatRefferalCodesTable float={state.float} onAction={this.refferalCodeAction}/>
      </>;
    }

    return null;
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
        <div className="balance-value">R0,001</div>
      </div>
    </div>;
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

  floatSave = data => {
    // TODO: update float (api needed)
    console.error('No API for float update');
  }

  refferalCodeAction = (action, item) => {
    // TODO: create/deactive refferal code (api needed)
    console.error('No API for refferal code create/deactive');
  }
}

export default ClientFloatPage;