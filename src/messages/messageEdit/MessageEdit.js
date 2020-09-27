import React from 'react';
import { forkJoin, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { capitalize, unmountDecorator, inject } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import MessageForm from '../messageForm/MessageForm';
import MessageSentResult from '../messageSentResult/MessageSentResult';

import './MessageEdit.scss';

class MessageEdit extends React.Component {
  constructor(props) {
    super();

    this.messagesService = inject('MessagesService');
    this.historyService = inject('HistoryService');
    this.modalService = inject('ModalService');
    this.clientsService = inject('ClientsService');

    this.state = {
      loading: false,
      mode: props.match.params.mode,
      message: null,
      sentResult: null,
      clients: []
    };

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadData();
  }
  
  render() {
    const state = this.state;
    const title = capitalize(`${state.mode} message`);

    return <div className="message-edit">
      <PageBreadcrumb title={title} link={{ to: '/messages', text: 'Messages' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        <MessageForm mode={state.mode}
          message={state.message}
          clients={state.clients}
          onSubmit={this.formSubmit}
          ref={ref => this.messageFormRef = ref}/>
      </div>
      {state.sentResult && <MessageSentResult {...state.sentResult}
          onAction={this.messageResultAction}/>}
    </div>;
  }

  messageResultAction = action => {
    if (action === 'close') {
      this.setState({ sentResult: null });
    } else if (action === 'create-new') {
      this.setState({ sentResult: null });
      this.messageFormRef.reset();
    } else if (action === 'go-to-home') {
      this.historyService.push('/');
    }
  }

  loadData() {
    const mode = this.state.mode;
    const messageId = this.props.match.params.id;

    this.setState({ loading: true });
    
    forkJoin([
      messageId ? this.messagesService.getMessage(messageId) : of(null),
      /(new|duplicate)/.test(mode) ? this.clientsService.getClients() : of([])
    ]).pipe(
      takeUntil(this.unmount)
    ).subscribe(([message, clients]) => {
      this.setState({ message, clients, loading: false });
    });
  }

  formSubmit = (messageBody, audienceBody) => {
    const mode = this.state.mode;

    if (mode === 'view') {
      this.setState({ mode: 'edit' });
      return;
    }

    this.setState({ loading: true });

    if (mode === 'edit') {
      const messageId = this.props.match.params.id;
      this.messagesService.updateMessage(messageId, messageBody).pipe(
        takeUntil(this.unmount)
      ).subscribe(() => {
        this.historyService.push('/messages');
      }, () => {
        this.setState({ loading: false });
        this.modalService.openCommonError();
      });
      return;
    }

    // new or duplicate
    this.messagesService.createMessage(messageBody, audienceBody).pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      this.setState({ loading: false, sentResult: { success: true } });
    }, () => {
      this.setState({ loading: false, sentResult: { success: false } });
    });
  }
}

export default MessageEdit;