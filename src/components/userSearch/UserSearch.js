import React from 'react';

import Input from 'components/input/Input';

import RadioButton from 'components/radioButton/RadioButton';

import './UserSearch.scss';

class UserSearch extends React.Component {
  options = [{
    text: 'Email address', placeholder: 'Enter email address', value: 'emailAddress'
  }, {
    text: 'Phone number', placeholder: 'Enter phone number', value: 'phoneNumber'
  }, {
    text: 'National ID', placeholder: 'Enter national ID', value: 'nationalId'
  }];

  constructor() {
    super();
    this.state = {
      search: '', searchBy: 'emailAddress'
    };
  }

  render() {
    const state = this.state;
    const option = this.options.find(item => item.value === state.searchBy);

    return <div className="user-search">
      <div className="manage-users">Manage Users</div>
      <div className="manage-description">To manage a user enter one of their following details below:</div>
      <div className="search-by">
        {this.options.map((item, index) => {
          return <RadioButton key={index} name="searchBy" checked={state.searchBy === item.value}
            value={item.value} onChange={this.inputChange}>
            {item.text}
          </RadioButton>
        })}
      </div>
      <div className="input-group">
        <Input value={this.state.search} onChange={this.inputChange} name="search"
          placeholder={option ? option.placeholder : 'Search'}/>
        <button className="button" onClick={this.searchClick}>Search</button>
      </div>
    </div>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  searchClick = () => {
    const { state, props } = this;
    if (state.search && props.onSearch) {
      props.onSearch({ search: state.search, searchBy: state.searchBy });
    }
  }
}

export default UserSearch;