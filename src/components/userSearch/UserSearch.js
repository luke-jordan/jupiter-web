import React from 'react';

import Input from 'src/components/input/Input';
import RadioButton from 'src/components/radioButton/RadioButton';
import { inject } from 'src/core/utils';

import './UserSearch.scss';

const searchTypes = [{
  text: 'Phone or email', value: 'phoneOrEmail',
  placeholder: 'Enter either phone or email address'
}, {
  text: 'National ID', value: 'nationalId',
  placeholder: 'Enter national ID', 
}, {
  text: 'Bank reference', value: 'bankReference',
  placeholder: 'Enter account name or bank reference of a transaction'
}];

class UserSearch extends React.Component {
  constructor() {
    super();
    this.historyService = inject('HistoryService');

    this.state = this.getSearchData();

    this.unlistenHistory = this.historyService.listen(() => {
      this.setState(this.getSearchData());
    });
  }

  componentWillUnmount() {
    this.unlistenHistory();
  }

  render() {
    const state = this.state;
    const selectedOption = searchTypes.find(item => item.value === state.searchType);

    return <form className="user-search" onSubmit={this.submit}>
      <div className="manage-users">Manage Users</div>
      <div className="manage-description">To manage a user enter one of their following details below:</div>
      <div className="search-by">
        {searchTypes.map((item, index) => {
          return <RadioButton key={index} name="searchType" checked={state.searchType === item.value}
            value={item.value} onChange={this.inputChange}>
            {item.text}
          </RadioButton>
        })}
      </div>
      <div className="input-group">
        <Input value={this.state.searchValue} onChange={this.inputChange} name="searchValue"
          placeholder={selectedOption ? selectedOption.placeholder : 'Search'}/>
        <button className="button">Search</button>
      </div>
    </form>;
  }

  inputChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  submit = event => {
    event.preventDefault();
    const { searchValue, searchType } = this.state;
    if (searchValue) {
      const params = new URLSearchParams({ searchValue, searchType });
      this.historyService.push(`/users?${params}`);
    }
  }

  getSearchData() {
    const params = new URLSearchParams(this.historyService.location.search);
    return {
      searchValue: params.get('searchValue') || '',
      searchType: params.get('searchType') || searchTypes[0].value
    };
  }
}

export default UserSearch;