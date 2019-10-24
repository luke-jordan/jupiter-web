import React from 'react';
import moment from 'moment';

import { inject, dictToOptions } from 'src/core/utils';
import { userHistoryEventTypeMap } from 'src/core/dictionaries';
import Tabs from 'src/components/tabs/Tabs';
import Select from 'src/components/select/Select';
import DatePicker from 'src/components/datePicker/DatePicker';

import './UserHistoryFilter.scss';

class UserHistoryFilter extends React.Component {
  constructor() {
    super();
    this.usersService = inject('UsersService');
    this.eventTypesOptions = dictToOptions(userHistoryEventTypeMap);
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
            {this.eventTypesOptions.map(option =>
              <option key={option.value} value={option.value}>{option.text}</option>)}
          </Select>
        </div>
        <div className="grid-col">
          <div className="filter-label">Start date:</div>
          <DatePicker placeholderText="Select date"
            selected={filter.startDate} onChange={this.startDateChange}/>
        </div>
        <div className="grid-col">
          <div className="filter-label">End date:</div>
          <DatePicker placeholderText="Select date"
            selected={filter.endDate} onChange={this.endDateChange}/>
        </div>
        <div className="grid-col">
          <div className="filter-label">Performed by:</div>
          <Tabs tabs={this.performedByTabs} activeTab={filter.performedBy}
            onChange={this.performedByChange}/>
        </div>
      </div>
    </div>;
  }

  eventTypeChange = event => {
    this.filterChanged({ ...this.props.filter, eventType: event.target.value });
  }

  startDateChange = value => {
    this.filterChanged({ ...this.props.filter, startDate: value });
  }

  endDateChange = value => {
    const endDate = value ? moment(value).endOf('day').toDate(): value;
    this.filterChanged({ ...this.props.filter, endDate });
  }

  performedByChange = value => {
    this.filterChanged({ ...this.props.filter, performedBy: value });
  }

  filterChanged(newFilter) {
    if (this.props.onChange) {
      this.props.onChange(newFilter);
    }
  }
}

export default UserHistoryFilter;