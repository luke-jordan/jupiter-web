import React from 'react';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';

import './CapitalizeInterestPage.scss';

class CapitalizeInterestPage extends React.Component {
  constructor(props) {
    super();

    this.floatUrl = this.getFloatUrl(props.location.pathname);

    this.state = {
      loading: false
    };
  }

  render() {
    return <div className="capitalize-interest-page">
      <PageBreadcrumb title="Capitalize Interest Preview" link={{ to: this.floatUrl, text: 'Float' }}/>
      <div className="page-content"></div>
    </div>;
  }

  renderContent() {
    return null;
  }

  getFloatUrl(pathname) {
    return pathname.substring(0, pathname.lastIndexOf('/'));
  }
}

export default CapitalizeInterestPage;