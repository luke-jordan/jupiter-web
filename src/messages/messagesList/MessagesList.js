import React from 'react';
import { NavLink } from 'react-router-dom';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import moment from 'moment';

import { inject } from 'services';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';

import './MessagesList.scss';
import sortIcon from 'assets/images/sort-by.svg';
import addIcon from 'assets/images/add.svg';

class MessagesList extends React.Component {
  constructor() {
    super();
    this.messagesService = inject('MessagesService');

    this.state = {
      loading: true,
      messages: []
    };

    this.unmount$ = new Subject();
  }

  componentDidMount() {
    this.messagesService.getMessages().pipe(
      takeUntil(this.unmount$)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  render() {
    return <div className="messages-list">
      <PageBreadcrumb title="Messages" link={{ to: '/', text: 'Home' }}/>
      <div className="messages-list-inner">
        {this.renderActions()}
        {this.renderTable()}
      </div>
    </div>;
  }

  renderActions() {
    return <div className="messages-actions">
      <button className="button button-outline" disabled={this.state.loading}>
        Sort by <img className="button-icon" src={sortIcon} alt="sort"/>
      </button>
      <NavLink to="/messages/new" className="button">
        New message <img className="button-icon" src={addIcon} alt="add"/>
      </NavLink>
    </div>;
  }

  renderTable() {
    const state = this.state;

    if (state.loading) {
      return <div className="text-center"><div className="spinner"/></div>;
    }

    if (state.messages.length === 0) {
      return <div className="text-center">No messages</div>
    }

    return <table className="table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Title</th>
          <th>Format</th>
          <th className="text-center">Start date</th>
          <th className="text-center">End date</th>
          <th className="text-center">Msgs</th>
          <th className="text-center">Queued</th>
          <th className="text-center">Priority</th>
        </tr>
      </thead>
      <tbody>
        {state.messages.map(message => this.renderTableRow(message))}
      </tbody>
    </table>;
  }

  renderTableRow(message) {
    const type = {
      RECURRING: 'Recurring',
      EVENT_DRIVEN: 'Event-Driven',
      ONCE_OFF: 'Once-Off'
    }[message.presentationType];

    const startTime = moment(message.startTime).format('DD/MM/YY hh:mmA');

    let endTime = moment(message.endTime);
    endTime = endTime.isAfter(moment().add(10, 'years')) ? '--' : endTime.format('DD/MM/YY hh:mmA');

    return <tr key={message.instructionId}>
      <td>{type}</td>
      <td>{message.templates.template.DEFAULT.title}</td>
      <td>{message.templates.template.DEFAULT.display.type}</td>
      <td className="text-center">{startTime}</td>
      <td className="text-center">{endTime}</td>
      <td className="text-center">{message.totalMessageCount}</td>
      <td className="text-center">{message.unfetchedMessageCount}</td>
      <td className="text-center">{message.messagePriority} </td>
    </tr>;
  }
}

export default MessagesList;