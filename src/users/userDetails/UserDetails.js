import React from 'react';

import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import UserSearch from 'components/userSearch/UserSearch'

import './UserDetails.scss';

class UserDetails extends React.Component {
  render() {
    return <div className="user-details">
      <PageBreadcrumb link={{ to: '/', text: 'Home' }} title={
        <UserSearch/>
      }/>
    </div>;
  }
}

export default UserDetails;