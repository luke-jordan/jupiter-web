import React from 'react';

import { messagePresentationTypeMap, messageDisplayTypeMap } from 'src/core/constants';
import { mapToOptions, deepCopy } from 'src/core/utils';
import Modal from 'src/components/modal/Modal';
import Checkbox from 'src/components/checkbox/Checkbox';
import DatePicker from 'src/components/datePicker/DatePicker';
import Select from 'src/components/select/Select';

import './messagesFilter.scss';
import sortIcon from 'src/assets/images/sort-by.svg';

class MessagesFilter extends React.Component {
  constructor() {
    super();

    this.messageTypes = mapToOptions(messagePresentationTypeMap);
    this.messageFormats = mapToOptions(messageDisplayTypeMap);

    this.state = {
      open: false,
      filter: {
        type: [],
        format: [],
        startDate: '',
        priority: ''
      }
    };
  }

  render() {
    return <div className="messages-filter">
      <button className="button button-outline" onClick={this.openClick}>
        Filter by <img className="button-icon" src={sortIcon} alt="sort"/>
      </button>
      {this.state.open && this.renderModal()}
    </div>;
  }

  renderModal() {
    const filter = this.state.filter;
    return <Modal className="messages-filter-modal"
        open header="Filter messages" onClose={this.cancelClick}>
      <div className="grid-row">
        <div className="grid-col">
          <div className="filter-title">Message type</div>
          {this.messageTypes.map(type => {
            return <Checkbox key={type.value}
              name={type.value}
              value={type.value}
              checked={filter.type.includes(type.value)}
              onChange={event => this.checkboxChanged('type', event)}>
              {type.text}
            </Checkbox>
          })}
        </div>
        <div className="grid-col">
          <div className="filter-title">Format</div>
          {this.messageFormats.map(format => {
            return <Checkbox key={format.value}
              name={format.value}
              value={format.value}
              checked={filter.format.includes(format.value)}
              onChange={event => this.checkboxChanged('format', event)}>
              {format.text}
            </Checkbox>
          })}
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col">
          <div className="filter-title">Start date</div>
          <DatePicker selected={filter.startDate} onChange={this.dateChanged}/>
        </div>
        <div className="grid-col">
          <div className="filter-title">Priority</div>
          <Select value={filter.priority} onChange={this.priorityChanged}>
            <option value="">All</option>
            <option value="71-100">High (71-100)</option>
            <option value="31-70">Medium (31-70)</option>
            <option value="0-30">Low (0-30)</option>
          </Select>
        </div>
      </div>
      <div className="grid-row">
        <div className="grid-col cancel-filter">
          <span className="link text-underline" onClick={this.canceClick}>Cancel</span>
        </div>
        <div className="grid-col text-right">
          <button type="button" className="button" onClick={this.filterClick}>Filter</button>
        </div>
      </div>
    </Modal>;
  }

  openClick = () => {
    this.setState({ open: true, prevFilter: deepCopy(this.state.filter) });
  }

  cancelClick = () => {
    this.setState({ open: false, filter: this.state.prevFilter });
  }

  filterClick = () => {
    this.props.onFilter(this.state.filter);
    this.setState({ open: false });
  }

  checkboxChanged(arrName, event) {
    const target = event.target;
    const filter = this.state.filter;
    this.updateFilter({
      [arrName]: target.checked ? filter[arrName].concat(target.name) :
        filter[arrName].filter(item => item !== target.name)
    });
  }

  dateChanged = date => {
    this.updateFilter({ startDate: date });
  }

  priorityChanged = event => {
    this.updateFilter({ priority: event.target.value });
  }

  updateFilter(changes) {
    this.setState({
      filter: { ...this.state.filter, ...changes }
    });
  }
}

export default MessagesFilter;