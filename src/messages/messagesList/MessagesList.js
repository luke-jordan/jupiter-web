import React from 'react';
import { NavLink } from 'react-router-dom';
import { Subject } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import moment from 'moment';

import { inject } from 'services';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import DropdownMenu from 'components/dropdownMenu/DropdownMenu';

import './MessagesList.scss';
import sortIcon from 'assets/images/sort-by.svg';
import addIcon from 'assets/images/add.svg';

class MessagesList extends React.Component {
  constructor() {
    super();
    this.messagesService = inject('MessagesService');
    this.historyService = inject('HistoryService');

    this.state = {
      init: false,
      loading: true,
      messages: []
    };

    this.unmount$ = new Subject();
  }

  componentDidMount() {
    this.messagesService.getMessages().pipe(
      takeUntil(this.unmount$)
    ).subscribe(messages => {
      this.setState({ messages, loading: false, init: true });
    });
  }

  componentWillUnmount() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  render() {
    const state = this.state;
    return <div className="messages-list">
      <PageBreadcrumb title="Messages" link={{ to: '/', text: 'Home' }}/>
      <div className="messages-list-inner">
        {state.loading && <div className="spinner-overlay"><div className="spinner"/></div>}
        {state.init && this.renderActions()}
        {state.init && this.renderTable()}
      </div>
    </div>;
  }

  renderActions() {
    const messagesAvailable = !!this.state.messages.length;
    return <div className="messages-actions">
      <div className="action-buttons">
        {messagesAvailable &&
          <button className="button button-outline">
            Filter by <img className="button-icon" src={sortIcon} alt="sort"/>
          </button>}
        <div></div>
        <NavLink to="/messages/new" className="button">
          New message <img className="button-icon" src={addIcon} alt="add"/>
        </NavLink>
      </div>
      {messagesAvailable &&
        <div className="quick-actions">
          Quick Actions: <span className="link">Deactivate</span>
        </div>}
    </div>;
  }

  renderTable() {
    const state = this.state;

    if (!state.messages.length) {
      return <div className="no-data">No messages</div>
    }

    return <table className="table">
      <thead>
        <tr>
          {/* <th style={{ width: 40 }}/> */}
          <th style={{ width: 125 }}>Type</th>
          <th>Title</th>
          <th style={{ width: 155 }}>Format</th>
          <th className="text-center" style={{ width: 100 }}>Start date</th>
          <th className="text-center" style={{ width: 100 }}>End date</th>
          <th className="text-center" style={{ width: 80 }}>Msgs</th>
          <th className="text-center" style={{ width: 80 }}>Queued</th>
          <th className="text-center" style={{ width: 80 }}>Priority</th>
          <th style={{ width: 40 }}/>
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

    const format = {
      CARD: 'Card',
      MODAL: 'Modal',
      PUSH: 'Push notification'
    }[message.templates.template.DEFAULT.display.type];

    const startTime = moment(message.startTime).format('DD/MM/YY hh:mmA');

    let endTime = moment(message.endTime);
    endTime = endTime.isAfter(moment().add(10, 'years')) ? '--' : endTime.format('DD/MM/YY hh:mmA');

    return <tr key={message.instructionId}>
      {/* <td></td> */}
      <td>{type}</td>
      <td>{message.templates.template.DEFAULT.title}</td>
      <td>{format}</td>
      <td className="text-center">{startTime}</td>
      <td className="text-center">{endTime}</td>
      <td className="text-center">{message.totalMessageCount}</td>
      <td className="text-center">{message.unfetchedMessageCount}</td>
      <td className="text-center">{message.messagePriority}</td>
      <td>
        <DropdownMenu items={[
          { text: 'View', tag: 'view' },
          { text: 'Edit', tag: 'edit' },
          { text: 'Duplicate', tag: 'duplicate' },
          { text: 'Deactivate', tag: 'deactivate' }
        ]} onItemClick={action => this.rowActionClick(action, message)}/>
      </td>
    </tr>;
  }

  rowActionClick(action, message) {
    if (action.tag === 'deactivate') {
      this.deactivateMessage(message.instructionId);
    } else {
      this.historyService.push(`/messages/${action.tag}/${message.instructionId}`);
    }
  }

  deactivateMessage(instructionId) {
    this.setState({ loading: true });
    this.messagesService.updateMessage(instructionId, { active: false }).pipe(
      mergeMap(() => this.messagesService.getMessages()),
      takeUntil(this.unmount$)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }
}

export default MessagesList;