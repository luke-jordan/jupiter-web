import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';

import './ClientFloatPage.scss';
import currencyIcon from 'src/assets/images/currency.svg';

class ClientFloatPage extends React.Component {
  constructor() {
    super();

    this.clientsService = inject('ClientsService');

    this.state = {
      loading: true,
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

    return <>
      {this.renderHeader()}
    </>;
  }

  renderHeader() {
    const float = this.state.float;
    return <div className="grid-row float-header">
      <div className="grid-col float-title">
        <img src={currencyIcon} alt="currency"/>
        <div className="float-name">Float: <b>{float.floatName}</b></div>
      </div>
      <div className="grid-col float-balance">
        <div className="balance-label">Total float balance</div>
        <div className="balance-value">R0,001</div>
      </div>
    </div>;
  }

  loadFloat() {
    const { clientId, floatId } = this.props.match.params;
    this.clientsService.getFloat(clientId, floatId).pipe(
      takeUntil(this.unmount)
    ).subscribe(float => {
      this.setState({ loading: false, float });
    });
  }
}

export default ClientFloatPage;