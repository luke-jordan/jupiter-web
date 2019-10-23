import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { tempStorage, inject, unmountDecorator } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'components/spinner/Spinner';
import Input from 'components/input/Input';
import Tabs from 'components/tabs/Tabs';
import UserWithBalance from '../userWithBalance/UserWithBalance';

import './UserHistoryPage.scss';

class UserHistoryPage extends React.Component {
  initialVisibleCount = 10;

  constructor() {
    super();

    this.usersService = inject('UsersService');
    this.historyService = inject('HistoryService');

    this.state = {
      loading: false,
      user: null,
      userEvents: [],
      filter: {
        keyword: '', performed: 'all'
      },
      visibleCount: this.initialVisibleCount,
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    const user = tempStorage.take('user-history');
    if (user) {
      this.userLoaded(user);
    } else {
      this.loadUserDetails();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.loadUserDetails();
    }
  }

  render() {
    return <div className="user-history-page">
      <PageBreadcrumb link={{ to: '/', text: 'Home' }} title="User History"/>
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
        {this.renderFilter()}
        {this.renderHistory()}
      </>;
    } else {
      return null;
    }
  }

  renderFilter() {
    const filter = this.state.filter;
    return <div className="history-filter">
      <div className="grid-row">
        <div className="grid-col">
          <div className="filter-label">Filter by:</div>
          <form className="input-group" onSubmit={e => { e.preventDefault(); this.filterEvents(); }}>
            <Input name="keyword" placeholder="Type keyword to filter"
              value={filter.keyword} onChange={this.filterKeywordChange}/>
            <button className="button">Filter</button>
          </form>
        </div>
        <div className="grid-col perfomed-tabs">
          <div className="filter-label">Performed by:</div>
          <Tabs tabs={[
            { text: 'All', value: 'all' },
            { text: 'User', value: 'user' },
            { text: 'Admin', value: 'admin' }
          ]} activeTab={filter.performed} onChange={this.filterPerformedChange}/>
        </div>
      </div>
    </div>;
  }

  renderHistory() {
    const state = this.state;

    const rows = state.userEvents.slice(0, state.visibleCount).map((event, index) => {
      return <tr key={index}>
        <td>{event.eventTypeText}</td>
        <td>{event.formattedDate}</td>
        <td></td>
      </tr>;
    });

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
    ).subscribe(user => this.userLoaded(user));
  }

  userLoaded(user) {
    this.setState({
      user,
      userEvents: user.userHistory.userEvents,
      loading: false
    });
  }

  showMoreEvents = () => {
    this.setState({ visibleCount: this.state.visibleCount + this.initialVisibleCount });
  }

  filterKeywordChange = event => {
    this.setState({
      filter: {
        ...this.state.filter, keyword: event.target.value
      }
    });
  }

  filterPerformedChange = value => {
    this.setState({
      filter: {
        ...this.state.filter, performed: value
      }
    }, this.filterEvents);
  }

  filterEvents = () => {
    const state = this.state;

    const newState = {
      visibleCount: this.initialVisibleCount,
      userEvents: state.user.userHistory.userEvents.slice()
    };

    if (state.filter.keyword) {
      const keyword = state.filter.keyword.toLowerCase();
      newState.userEvents = newState.userEvents.filter(event => {
        return (
          event.eventTypeText.toLowerCase().includes(keyword) ||
          event.eventType.toLowerCase().includes(keyword)
        );
      });
    }

    if (state.filter.performed) {
      // filter by performed
    }

    this.setState(newState);
  }
}

export default UserHistoryPage;