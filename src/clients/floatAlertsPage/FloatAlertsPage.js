import React from 'react';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';

import './FloatAlertsPage.scss';

class FloatAlertsPage extends React.Component {
  render() {
    return <div className="float-alerts-page">
      <PageBreadcrumb title="Alerts" link={{ to: '/clients', text: 'Clients' }}/>
      <div className="page-content">
        float alerts
      </div>
    </div>;
  }
}

export default FloatAlertsPage;