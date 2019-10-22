import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { tempStorage, inject, unmountDecorator } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'components/spinner/Spinner';

import './UserHistoryPage.scss';

class UserHistoryPage extends React.Component {
  constructor() {
    super();

    this.usersService = inject('UsersService');
    this.historyService = inject('HistoryService');

    this.state = {
      loading: false,
      user: null
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    const user = tempStorage.take('user-history');
    if (user) {
      this.setState({ user });
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
      <PageBreadcrumb link={{ to: '/', text: 'Home' }} title="User history"/>
      <div className="page-content">{this.renderContent()}</div>
    </div>;
  }

  renderContent() {
    const state = this.state;
    if (state.loading) {
      return <div className="text-center"><Spinner/></div>;
    } else if (state.user) {
      return state.user.userHistory.totalCount;
    } else {
      return null;
    }
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
    ).subscribe(user => {
      this.setState({ loading: false, user });
    });
  }
}

export default UserHistoryPage;