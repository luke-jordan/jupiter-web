import React from 'react';

import './UserSearch.scss';

class UserSearch extends React.Component {
  constructor() {
    super();
    this.state = { search: '' };
  }
  render() {
    return <div className="user-search">
      <div className="manage-users">Manage Users</div>
      <div className="manage-description">To manage a user enter one of their following details below:</div>
      <div className="input-group">
        <input type="text" className="form-input" value={this.state.search}
          onChange={this.searchValueChange}
          placeholder="Enter users ID/Phone Number or Email Address"/>
        <button className="button" onClick={this.searchClick}>Search</button>
      </div>
    </div>;
  }

  searchValueChange = (event) => {
    this.setState({ search: event.target.value });
  }

  searchClick = () => {
    console.log(this.state.search);
  }
}

export default UserSearch;