import React from 'react';
import { NavLink } from 'react-router-dom';
import { takeUntil } from 'rxjs/operators';

import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import UserSearch from 'src/components/userSearch/UserSearch';
import Spinner from 'src/components/spinner/Spinner';
import { inject, unmountDecorator } from 'src/core/utils';
import UserWithBalance from '../userWithBalance/UserWithBalance';
import UserStatusForm from '../userStatusForm/UserStatusForm';
import UserTransactions from '../userTransactions/UserTransactions';

import './UserSearchPage.scss';
import arrowRightWhite from 'src/assets/images/arrow-right-white.svg';
import UsersListPage from '../usersListPage/UsersListPage';

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

    if (state.loading) {
      return <Spinner overlay/>;
    }

    if (state.user) {
      return this.renderUserDetails();
    }

    return this.renderUserList();
  }

  renderUserDetails() {
    const state = this.state;
    return <>
      <div className="user-found">USER FOUND:</div>
      <div className="card user-details">
        <div className="card-header">
          <UserWithBalance user={state.user}/>
          <div className="view-user-history">
            <NavLink className="button" to={{ pathname: '/users/history', search: this.historyService.location.search }}>
              View user history <img className="button-icon" src={arrowRightWhite} alt="arrow"/>
            </NavLink>
          </div>
        </div>
        <div className="card-body">
          <UserStatusForm user={state.user} onSubmit={this.userStatusChange} onUpload={this.uploadFileForUser}/>
          <UserTransactions user={state.user} onChanged={this.searchUser}/>
        </div>
      </div>
    </>;
  }

  renderUserList() {
    return <>
      <div className="card user-list">
        <UsersListPage accounts={this.state.possibleUsers} />
      </div>
    </>
  }

  componentDidMount() {
    this.searchUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.searchUser();
    }
  }

  searchUser = () => {
    const params = new URLSearchParams(this.props.location.search);
    const searchValue = params.get('searchValue');
    const searchType = params.get('searchType');

    if (!searchValue || !searchType) {
      return;
    }

    this.setState({ loading: true, error: null });

    this.usersService.searchUser({ [searchType]: searchValue }).pipe(
      takeUntil(this.unmount)
    ).subscribe(response => {
      console.log('Search result: ', response);
      if (response.length === 0) {
        this.setState({ loading: false, possibleUsers: null, user: null, error: 'USER NOT FOUND: Please check the user details and try again' });
      } else if (response.length === 1) {
        this.setState({ loading: false, error: null, possibleUsers: null, user: response.user });  
      } else {
        this.setState({ loading: false, error: null, user: null, possibleUsers: response.possibleUsers });
      }
    }, (error) => {
      console.log('Error finding user: ', error);
      if (error && error.status === 404) {
        this.setState({ loading: false, possibleUsers: null, user: null, error: 'USER NOT FOUND: Please check the user details and try again' });
      } else {
        this.setState({ loading: false, user: null, error: 'Error on backend searching for user, please contact dev team' });
      }
    });
  }

  userStatusChange = (data, reloadAfterSubmit = true) => {
    this.setState({ loading: true });
    this.usersService.updateUser(data).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      // show a friendly modal, and reload the user when it is closed
      this.setState({ loading: false });
      const onCloseFn = reloadAfterSubmit ? this.searchUser : null;
      this.modalService.openInfo('Done!', `The user's properties have been updated successfully`, onCloseFn);
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }

  uploadFileForUser = data => {
    this.setState({ loading: true });

    this.usersService.uploadFile(data).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      // no need to reload on this one, because the file becomes visible in the history, which will fetch the events again
      this.setState({ loading: false });
      this.modalService.openInfo('Done!', 'The file has been stored for the user, and will be visibile in their history');
    }, () => {
      this.setState({ loading: false });
      this.modalService.openCommonError();
    });
  }

}

export default UserSearchPage;