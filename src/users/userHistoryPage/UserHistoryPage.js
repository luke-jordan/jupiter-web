import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { inject, unmountDecorator } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import UserWithBalance from '../userWithBalance/UserWithBalance';
import UserHistoryFilter from '../userHistoryFilter/UserHistoryFilter';

import './UserHistoryPage.scss';

class UserHistoryPage extends React.Component {
  initialVisibleCount = 10;

  constructor() {
    super();

    this.usersService = inject('UsersService');
    this.historyService = inject('HistoryService');
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      user: null,
      userEvents: [],
      filter: {
        eventType: 'ALL',
        startDate: null,
        endDate: null,
        performedBy: 'ALL'
      },
      visibleCount: this.initialVisibleCount,
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.loadUserDetails();
    }
  }

  render() {
    const userLink = `/users${this.historyService.location.search}`;
    return <div className="user-history-page">
      <PageBreadcrumb link={{ to: userLink, text: 'User' }} title="User History"/>
      <div className="page-content">{this.renderContent()}</div>
    </div>;
  }

  renderContent() {
    const state = this.state;
    if (state.loading) {
      return <div className="text-center"><Spinner/></div>;
    } else if (state.user) {
      return <>
        <UserWithBalance user={state.user}/>
        <UserHistoryFilter filter={state.filter} onChange={this.filterChange}/>
        {this.renderHistory()}
      </>;
    } else {
      return null;
    }
  }

  onClickDownload = (browserEvent, serverEventContext) => {
    browserEvent.preventDefault();
    console.log('Event context: ', serverEventContext);
    this.downloadFile(serverEventContext);
  }

  showDownloadLink(eventContext) {
    return <button className="link text-underline" onClick={event => this.onClickDownload(event, eventContext)}>Download file</button>;
  }

  onClickMarkSuspicious = (browserEvent, serverEventContext) => {
    browserEvent.preventDefault();
    console.log('Would do something with: ', serverEventContext);
  };

  showMarkSuspiciousLink(eventContext) {
    return (
      <button className="link text-underline" onClick={browserEvent => this.onClickMarkSuspicious(browserEvent, eventContext)}>Mark suspicious/fraudulent</button>
    );
  }

  renderAdditionalEventAction(eventType, eventContext) {
    switch (eventType) {
      case 'ADMIN_STORED_DOCUMENT':
        return this.showDownloadLink(eventContext);
      case 'SAVING_PAYMENT_SUCCESSFUL':
        return this.showMarkSuspiciousLink(eventContext);
      default:
        return null;
    }
  }

  renderEvent(event, index) {
    const additionalAction = this.renderAdditionalEventAction(event.eventType, event.context);
    return <tr key={index}>
      <td>{event.eventTypeText}{additionalAction || ''}</td>
      <td>{event.formattedDate}</td>
      <td></td>
    </tr>;
  }

  renderHistory() {
    const state = this.state;

    const rows = state.userEvents.slice(0, state.visibleCount)
      .map((event, index) => this.renderEvent(event, index));

    const showMore = state.userEvents.length > state.visibleCount &&
      <div className="show-more-history">
        <span className="link" onClick={this.showMoreEvents}>Show more</span>
      </div>

    return <>
      <table className="table">
        <thead>
          <tr>
            <th>Activity ({state.userEvents.length})</th>
            <th style={{width: 170}}>Date</th>
            <th style={{width: 170}}>Performed by</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows : <tr><td colSpan="3" className="no-data">No history</td></tr>}
        </tbody>
      </table>
      {showMore}
    </>;
  }
  
  loadUserDetails() {
    const params = new URLSearchParams(this.props.location.search);
    const searchValue = params.get('searchValue');
    const searchType = params.get('searchType');

    if (!searchValue || !searchType) {
      this.historyService.push('/users');
      return;
    }

    this.setState({ loading: true });

    this.usersService.searchUser({ [searchType]: searchValue }).pipe(
      takeUntil(this.unmount)
    ).subscribe(result => {
      const { user } = result;
      this.setState({
        user,
        userEvents: user.userHistory.userEvents,
        loading: false
      });
    });
  }

  downloadFile({ filename, mimeType }) {
    const params = { systemWideUserId: this.state.user.systemWideUserId, filename, mimeType };
    this.usersService.fetchFile(params).pipe(
      takeUntil(this.unmount)
    ).subscribe(result => {
      console.log('Result: ', result);
      const { fileContent } = result;
      const a = document.createElement('a'); //Create <a>
      a.href = `data:${mimeType};base64,${fileContent}`; //File Base64 Goes here
      a.download = filename;
      a.click(); //Downloaded file
    }, (err) => {
      console.log('Error: ', err);
      this.modalService.openCommonError();
    });
  }

  showMoreEvents = () => {
    this.setState({ visibleCount: this.state.visibleCount + this.initialVisibleCount });
  }

  filterChange = filter => {
    this.setState({ filter }, () => this.filterEvents());
  }

  filterEvents() {
    const state = this.state;
    const filter = state.filter;

    const newState = {
      visibleCount: this.initialVisibleCount,
      userEvents: state.user.userHistory.userEvents.slice()
    };

    if (filter.eventType !== 'ALL') {
      newState.userEvents = newState.userEvents.filter(event => event.eventType === filter.eventType);
    }

    if (filter.startDate) {
      newState.userEvents = newState.userEvents.filter(event => event.date >= filter.startDate);
    }

    if (filter.endDate) {
      newState.userEvents = newState.userEvents.filter(event => event.date <= filter.endDate);
    }

    if (filter.performedBy !== 'ALL') {
      // filter by performed
    }

    this.setState(newState);
  }
}

export default UserHistoryPage;