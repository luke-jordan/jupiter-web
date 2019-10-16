import React from 'react';

import { inject } from 'utils';
import Input from 'components/input/Input';

import './UserSearch.scss';

class UserSearch extends React.Component {
  constructor() {
    super();
    this.state = { search: '' };

    this.historyService = inject('HistoryService');
  }
  render() {
    return <div className="user-search">
      <div className="manage-users">Manage Users</div>
      <div className="manage-description">To manage a user enter one of their following details below:</div>
      <div className="input-group">
        <Input value={this.state.search} onChange={this.searchValueChange}
          placeholder="Enter users ID/Phone Number or Email Address"/>
        <button className="button" onClick={this.searchClick}>Search</button>
      </div>
    </div>;
  }

  searchValueChange = (event) => {
    this.setState({ search: event.target.value });
  }

  searchClick = () => {
    this.historyService.push(`/users?search=${this.state.search}`);
  }
}

export default UserSearch;