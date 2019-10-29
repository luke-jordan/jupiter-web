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
    this.modalService = inject('ModalService');

    this.state = {
      loading: false,
      error: null,
      user: null
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

    if (state.error) {
      return <div className="user-not-found">{state.error}</div>;
    }

    if (state.loading || state.user) {
      return <>
        {state.loading && <Spinner overlay/>}
        {state.user && this.renderUserDetails()}
      </>;
    }

    return null;
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
          <UserStatusForm user={state.user} onSubmit={this.userStatusChange}/>
          <UserTransactions user={state.user}/>
        </div>
      </div>
    </>;
  }

  componentDidMount() {
    this.searchUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.searchUser();
    }
  }

  searchUser() {
    const params = new URLSearchParams(this.props.location.search);
    const searchValue = params.get('searchValue');
    const searchType = params.get('searchType');

    if (!searchValue || !searchType) {
      return;
    }

    this.setState({ loading: true, error: null });

    this.usersService.searchUser({ [searchType]: searchValue }).pipe(
      takeUntil(this.unmount)
    ).subscribe(user => {
      this.setState({
        loading: false,
        error: null,
        user
      });
    }, () => {
      this.setState({
        loading: false, user: null,
        error: 'USER NOT FOUND: Please check the user details and try again'
      });
    });
  }

  statusFormChange = statusData => {
    this.setState({ statusData });
  }

  userStatusChange = data => {
    // TODO: Update user (api needed)
    console.log(data);

    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, user: Object.assign({}, this.state.user) });
      this.modalService.showInfo('Info', 'User update API is not implemented yet');
    }, 500);
  }
}

export default UserSearchPage;