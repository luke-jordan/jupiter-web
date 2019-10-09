import React from 'react';
import { NavLink } from 'react-router-dom';
import { forkJoin } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';
import classNames from 'classnames';

import { inject, unmountDecorator } from 'utils';
import PageBreadcrumb from 'components/pageBreadcrumb/PageBreadcrumb';
import DropdownMenu from 'components/dropdownMenu/DropdownMenu';
import Spinner from 'components/spinner/Spinner';
import Checkbox from 'components/checkbox/Checkbox';

import './MessagesList.scss';
import sortIcon from 'assets/images/sort-by.svg';
import addIcon from 'assets/images/add.svg';

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
      takeUntil(this.unmount$)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }

  render() {
    const state = this.state;
    return <div className="messages-list">
      <PageBreadcrumb title="Messages" link={{ to: '/', text: 'Home' }}/>
      <div className="messages-list-inner">
        {state.loading && <Spinner overlay/>}
        {this.renderActions()}
        {this.renderTable()}
      </div>
    </div>;
  }

  renderActions() {
    const { checkedMessages } = this.state;
    return <div className="messages-actions">
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
          <th style={{ width: 40 }}>
            <Checkbox checked={state.checkAll} onChange={this.checkAllChange}
              disabled={!state.messages.length}/>
          </th>
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
        <Checkbox checked={checked} onChange={checked => this.checkMessageChange(checked, message)}/>
      </td>
      <td>{message.presentationTypeName}</td>
      <td>{message.templates.template.DEFAULT.title}</td>
      <td>{message.format}</td>
      <td className="text-center">{message.displayStartTime}</td>
      <td className="text-center">{message.displayEndTime}</td>
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
      this.deactivateMessages([message.instructionId]);
    } else {
      this.historyService.push(`/messages/${action.tag}/${message.instructionId}`);
    }
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
      takeUntil(this.unmount$)
    ).subscribe(messages => {
      this.setState({ messages, loading: false });
    });
  }

  checkMessageChange(checked, message) {
    const { checkedMessages } = this.state;
    this.setState({
      checkedMessages: checked ?
        [...checkedMessages, message.instructionId] :
        checkedMessages.filter(id => id !== message.instructionId)
    });
  }

  checkAllChange = checkAll => {
    this.setState({
      checkAll,
      checkedMessages: checkAll ? this.state.messages.map(m => m.instructionId): []
    });
  }
}

export default MessagesList;