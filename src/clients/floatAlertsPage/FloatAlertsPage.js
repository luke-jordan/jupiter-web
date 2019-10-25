import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';

import './FloatAlertsPage.scss';

class FloatAlertsPage extends React.Component {
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
    const { state, props } = this;

    const title = state.float ? `Alerts: ${state.float.floatName}` : 'Alerts';
    const link = props.location.pathname.slice(0, props.location.pathname.lastIndexOf('/'));

    const alerts = state.float && state.float.floatAlerts;

    return <div className="float-alerts-page">
      <PageBreadcrumb title={title} link={{ to: link, text: 'Float' }}/>
      <div className="page-content">
        {state.loading ?
          <div className="text-center"><Spinner/></div> :
          <pre>{JSON.stringify(alerts, null, 2)}</pre>}
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
}

export default FloatAlertsPage;