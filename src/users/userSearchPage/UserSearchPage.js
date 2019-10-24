import React from 'react';
import { takeUntil } from 'rxjs/operators';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import UserSearch from 'src/components/userSearch/UserSearch';
import Spinner from 'src/components/spinner/Spinner';
import { inject, unmountDecorator } from 'src/core/utils';
import UserWithBalance from '../userWithBalance/UserWithBalance';
import UserStatusForm from '../userStatusForm/UserStatusForm';
import UserTransactions from '../userTransactions/UserTransactions';

import './UserSearchPage.scss';

class UserSearchPage extends React.Component {
  constructor() {
    super();
    
    this.historyService = inject('HistoryService');
    this.usersService = inject('UsersService');

    this.state = {
      loading: false,
      error: null,
      user: null,
      statusData: null,
      blank: false
    };

    unmountDecorator(this);
  }

  render() {
    return <div className="user-search-page">
      <PageBreadcrumb link={{ to: '/', text: 'Home' }} title={<UserSearch/>}/>
      <div className="page-content">{this.renderContent()}</div>
    </div>;
  }

  renderContent() {
    const state = this.state;

    if (state.blank) {
      return null;
    }

    if (state.error) {
      return <div className="user-not-found">{state.error}</div>;
    }

    return <>
      {state.loading && <Spinner overlay/>}
      {state.user && this.renderUserDetails()}
    </>;
  }

  renderUserDetails() {
    const state = this.state;
    return <>
      <div className="user-found">USER FOUND:</div>
      <div className="card user-details">
        <div className="card-header">
          <UserWithBalance user={state.user}/>
        </div>
        <div className="card-body">
          <UserStatusForm user={state.user} statusData={state.statusData}
            onChange={this.statusFormChange} onSubmitStatus={this.statusFormSubmit}/>
          <UserTransactions user={state.user}/>
        </div>
      </div>
    </>;
  }

  componentDidMount() {
    this.loadUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.loadUserDetails();
    }
  }

  loadUserDetails() {
    const params = new URLSearchParams(this.props.location.search);
    const searchValue = params.get('searchValue');
    const searchType = params.get('searchType');

    const notFound = 'USER NOT FOUND: Please check the user details and try again';

    if (!searchValue || !searchType) {
      this.setState({ error: notFound });
      return;
    }

    this.setState({ loading: true, blank: false, error: null });

    this.usersService.searchUser({ [searchType]: searchValue }).pipe(
      takeUntil(this.unmount)
    ).subscribe(user => {
      this.setState({
        loading: false,
        error: null,
        user,
        statusData: {
          userStatus: user.userStatus, userStatusChangeReason: '',
          kycStatus: user.kycStatus, kycStatusChangeReason: ''
        }
      });
    }, () => {
      this.setState({ loading: false, error: notFound, user: null });
    });
  }

  statusFormChange = statusData => {
    this.setState({ statusData });
  }

  statusFormSubmit = type => {
    this.setState({ loading: true });

    setTimeout(() => {
      const state = this.state;
      const newState = {
        user: { ...state.user }, loading: false,
        statusData: { ...state.statusData }
      };

      if (type === 'status') {
        newState.user.userStatus = state.statusData.userStatus;
        newState.statusData.userStatusChangeReason = '';
      } else if (type === 'kyc') {
        newState.user.kycStatus = state.statusData.kycStatus;
        newState.statusData.kycStatusChangeReason = '';
      }

      this.setState(newState);
    }, 500);
  }
}

export default UserSearchPage;