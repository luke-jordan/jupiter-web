import React from 'react';

import { inject } from 'utils';
import Tabs from 'components/tabs/Tabs';
import Select from 'components/select/Select';

import './UserHistoryFilter.scss';

class UserHistoryFilter extends React.Component {
  constructor() {
    super();
    this.usersService = inject('UsersService');
    this.eventTypeOptions = this.usersService.getEventTypeOptions();
    this.performedByTabs = [
      { text: 'All', value: 'ALL' },
      { text: 'User', value: 'USER' },
      { text: 'Admin', value: 'ADMIN' }
    ];
  }

  render() {
    const filter = this.props.filter;
    return <div className="user-history-filter">
      <div className="grid-row">
        <div className="grid-col">
          <div className="filter-label">Event type:</div>
          <Select name="eventType" onChange={this.eventTypeChange} value={filter.eventType}>
            {this.eventTypeOptions.map(option =>
              <option key={option.value} value={option.value}>{option.text}</option>)}
          </Select>
        </div>
        <div className="grid-col perfomed-by">
          <div className="filter-label">Performed by:</div>
          <Tabs tabs={this.performedByTabs} activeTab={filter.performedBy}
            onChange={this.performedByChange}/>
        </div>
      </div>
    </div>;
  }

  eventTypeChange = event => {
    this.filterChanged({
      ...this.props.filter, eventType: event.target.value
    });
  }

  performedByChange = value => {
    this.filterChanged({
      ...this.props.filter, performedBy: value
    });
  }

  filterChanged(newFilter) {
    if (this.props.onChange) {
      this.props.onChange(newFilter);
    }
  }
}

export default UserHistoryFilter;