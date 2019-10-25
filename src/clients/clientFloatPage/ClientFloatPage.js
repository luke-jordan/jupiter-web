import React from 'react';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';

import './ClientFloatPage.scss';

class ClientFloatPage extends React.Component {
  render() {
    return <div className="client-float-page">
      <PageBreadcrumb title="Manage Float" link={{ to: '/clients', text: 'Clients' }}/>
      <div className="page-content">
        client floats
      </div>
    </div>;
  }
}

export default ClientFloatPage;