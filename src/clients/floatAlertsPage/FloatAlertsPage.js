import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import Tabs from 'src/components/tabs/Tabs';
import Input from 'src/components/input/Input';
import FloatAlertActions from '../floatAlertActions/FloatAlertActions';

import './FloatAlertsPage.scss';
import alertInfoIcon from 'src/assets/images/alert-info.svg';
import alertErrorIcon from 'src/assets/images/alert-error.svg';

class FloatAlertsPage extends React.Component {
  constructor() {
    super();
    this.clientsService = inject('ClientsService');

    this.state = {
      loading: false,
      float: null,
      alerts: [],
      filter: {
        tab: 'ALL',
        keyword: ''
      }
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

    return <div className="float-alerts-page">
      <PageBreadcrumb title={title} link={{ to: link, text: 'Float' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        {state.float && <>
          {this.renderFilter()}
          {this.renderTable()}
        </>}
      </div>
    </div>;
  }

  renderFilter() {
    const filter = this.state.filter;
    return <div className="alerts-filter">
      <div className="grid-row">
        <div className="grid-col">
          <div className="filter-label">Filter by:</div>
          <div className="input-group">
            <Input value={filter.keyword} onChange={this.filterKeywordChange} name="keyword"
              placeholder="Type keyword to filter"/>
            <button className="button" onClick={this.filterAlerts}>Filter</button>
          </div>
        </div>
        <div className="grid-col">
          <div className="filter-label">Show:</div>
          <Tabs tabs={[
            { value: 'ALL', text: 'All' },
            { value: 'RESOLVED', text: 'Resolved' }
          ]} activeTab={filter.tab} onChange={this.filterTabChange}/>
        </div>
      </div>
    </div>;
  }

  renderTable() {
    const rows = this.state.alerts.map(floatAlert => {
      return <tr key={floatAlert.logId}>
        <td>
          <img className="alert-icon"  alt="alert"
            src={floatAlert.isRedFlag ? alertErrorIcon : alertInfoIcon}/>
          {floatAlert.logDescription}
        </td>
        <td>{floatAlert.formattedDate}</td>
        <td>
          <FloatAlertActions float={this.state.float} floatAlert={floatAlert}/>
        </td>
      </tr>
    });

    return <table className="table">
      <thead>
        <tr>
          <th>Alert</th>
          <th style={{width: 150}}>Updated</th>
          <th style={{width: 200}}>Action</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows :
          <tr><td colSpan="3" className="no-data">No alerts</td></tr>}
      </tbody>
    </table>
  }

  loadFloat() {
    this.setState({ loading: true });
    const { clientId, floatId } = this.props.match.params;
    this.clientsService.getFloat(clientId, floatId).pipe(
      takeUntil(this.unmount)
    ).subscribe(float => {
      this.setState({
        loading: false,
        float,
        alerts: float.floatAlerts
      });
    });
  }

  filterTabChange = tab => {
    this.setState({
      filter: { ...this.state.filter, tab }
    }, this.filterAlerts);
  }

  filterKeywordChange = event => {
    this.setState({
      filter: { ...this.state.filter, keyword: event.target.value }
    });
  }

  filterAlerts = () => {
    const filter = this.state.filter;
    let alerts = this.state.float.floatAlerts.slice();

    if (filter.tab === 'RESOLVED') {
      alerts = alerts.filter(alert => alert.isResolved);
    }

    if (filter.keyword) {
      alerts = alerts.filter(alert =>
        alert.logDescription.toLowerCase().includes(filter.keyword.toLowerCase())
      );
    }

    this.setState({ alerts });
  }
}

export default FloatAlertsPage;