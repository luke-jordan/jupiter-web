import React from 'react';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';

import './ClientsListPage.scss';

class ClientsListPage extends React.Component {
  render() {
    return <div className="clients-list-page">
      <PageBreadcrumb title="Clients & Floats" link={{ to: '/', text: 'Home' }}/>
      <div className="page-content">
        clients list
      </div>
    </div>;
  }
}

export default ClientsListPage;