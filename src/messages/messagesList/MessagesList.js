import React from 'react';
import { NavLink } from 'react-router-dom';
import { forkJoin } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import classNames from 'classnames';

import { inject, unmountDecorator } from 'src/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import DropdownMenu from 'src/components/dropdownMenu/DropdownMenu';
import Spinner from 'src/components/spinner/Spinner';
import Checkbox from 'src/components/checkbox/Checkbox';

import './MessagesList.scss';
import sortIcon from 'src/assets/images/sort-by.svg';
import addIcon from 'src/assets/images/add.svg';

class MessagesList extends React.Component {
  constructor() {
    super();
    this.messagesService = inject('MessagesService');
    this.historyService = inject('HistoryService');

    this.state = {
      loading: true,
      messages: [],
      checkedMessages: [],
      checkAll: false
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.messagesService.getMessages().pipe(
      takeUntil(this.unmount)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }

  render() {
    const state = this.state;
    return <div className="messages-list">
      <PageBreadcrumb title="Messages" link={{ to: '/', text: 'Home' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        {this.renderActions()}
        {this.renderTable()}
      </div>
    </div>;
  }

  renderActions() {
    const { checkedMessages } = this.state;
    return <div className="page-actions">
      <div className="action-buttons">
        <button className="button button-outline">
          Filter by <img className="button-icon" src={sortIcon} alt="sort"/>
        </button>
        <NavLink to="/messages/new" className="button">
          New message <img className="button-icon" src={addIcon} alt="add"/>
        </NavLink>
      </div>
      <div className="quick-actions">
        Quick Actions:&nbsp;
        <span className={classNames('link', { inactive: !checkedMessages.length })}
          onClick={this.deactivateCheckedMessages}>Deactivate</span>
      </div>
    </div>;
  }

  renderTable() {
    const state = this.state;
    return <table className="table">
      <thead>
        <tr>
          <th className="text-center" style={{ width: 40 }}>
            <Checkbox checked={state.checkAll} onChange={this.checkAllMessages}
              disabled={!state.messages.length}/>
          </th>
          <th style={{ width: 125 }}>Type</th>
          <th>Title</th>
          <th style={{ width: 155 }}>Format</th>
          <th className="text-center" style={{ width: 100 }}>Start date</th>
          <th className="text-center" style={{ width: 100 }}>End date</th>
          <th className="text-center" style={{ width: 80 }}># Msgs</th>
          <th className="text-center" style={{ width: 80 }}>Queued</th>
          <th className="text-center" style={{ width: 80 }}>Priority</th>
          <th style={{ width: 40 }}/>
        </tr>
      </thead>
      <tbody>
        {state.messages.length ?
          state.messages.map(message => this.renderTableRow(message)) :
          <tr><td className="no-data" colSpan="10">No messages</td></tr>}
      </tbody>
    </table>;
  }

  renderTableRow(message) {
    const checked = this.state.checkedMessages.includes(message.instructionId);
    return <tr key={message.instructionId}>
      <td className="text-center">
        <Checkbox checked={checked} onChange={event => this.checkMessage(event, message)}/>
      </td>
      <td>{message.presentationTypeText}</td>
      <td>{message.templates.template.DEFAULT.title}</td>
      <td>{message.displayTypeText}</td>
      <td className="text-center">{message.formattedStartDate}</td>
      <td className="text-center">{message.formattedEndDate}</td>
      <td className="text-center">{message.totalMessageCount}</td>
      <td className="text-center">{message.unfetchedMessageCount}</td>
      <td className="text-center">{message.messagePriority}</td>
      <td>
        <DropdownMenu items={[
          { text: 'View', link: `/messages/view/${message.instructionId}` },
          { text: 'Edit', link: `/messages/edit/${message.instructionId}` },
          { text: 'Duplicate', link: `/messages/duplicate/${message.instructionId}` },
          { text: 'Deactivate', click: () => this.deactivateMessages([message.instructionId]) }
        ]}/>
      </td>
    </tr>;
  }

  checkMessage(event, message) {
    const { checkedMessages } = this.state;
    this.setState({
      checkedMessages: event.target.checked ?
        [...checkedMessages, message.instructionId] :
        checkedMessages.filter(id => id !== message.instructionId)
    });
  }

  checkAllMessages = event => {
    const checked = event.target.checked;
    this.setState({
      checkAll: checked,
      checkedMessages: checked ? this.state.messages.map(m => m.instructionId): []
    });
  }

  deactivateCheckedMessages = () => {
    const ids = this.state.checkedMessages;
    if (ids.length) {
      this.deactivateMessages(ids);
    }
  }

  deactivateMessages(ids) {
    this.setState({ loading: true });
    forkJoin(
      ids.map(id => {
        return this.messagesService.updateMessage(id, { active: false });
      })
    ).pipe(
      mergeMap(() => this.messagesService.getMessages()),
      takeUntil(this.unmount)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }
}

export default MessagesList;