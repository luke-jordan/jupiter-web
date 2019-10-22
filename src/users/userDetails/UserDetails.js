import React from 'react';
import { takeUntil } from 'rxjs/operators';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import UserSearch from 'components/userSearch/UserSearch';
import Spinner from 'components/spinner/Spinner';
import { inject, unmountDecorator } from 'utils';

import './UserDetails.scss';

class UserDetails extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');
    this.usersService = inject('UsersService');

    this.state = {
      loading: false,
      user: null,
      blank: false
    };

    unmountDecorator(this);
  }

  render() {
    return <div className="user-details">
      <PageBreadcrumb link={{ to: '/', text: 'Home' }} title={<UserSearch/>}/>
      <div className="page-content">{this.renderContent()}</div>
    </div>;
  }

  renderContent() {
    const state = this.state;
    if (state.blank) {
      return null;
    } else if (state.loading) {
      return <div className="text-center"><Spinner/></div>;
    } else if (state.user) {
      return <pre>{JSON.stringify(state.user, null, 2)}</pre>;
    } else {
      return <div className="user-not-found">USER NOT FOUND: Please check the user details and try again</div>;
    }
  }

  componentDidMount() {
    this.getUserDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.getUserDetails();
    }
  }

  getUserDetails() {
    const params = new URLSearchParams(this.props.location.search);
    const searchValue = params.get('searchValue');
    const searchType = params.get('searchType');

    if (!searchValue) {
      this.setState({ blank: true });
      return;
    }

    this.setState({ loading: true, blank: false });

    this.usersService.searchUser({ [searchType]: searchValue }).pipe(
      takeUntil(this.unmount)
    ).subscribe(user => {
      this.setState({ loading: false, user });
    }, () => {
      this.setState({ loading: false, user: null });
    });
  }
}

export default UserDetails;