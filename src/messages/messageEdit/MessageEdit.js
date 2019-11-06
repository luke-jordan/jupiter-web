import React from 'react';
import { takeUntil } from 'rxjs/operators';

import { capitalize, unmountDecorator, inject } from 'src/core/utils';
import PageBreadcrumb from 'src/components/pageBreadcrumb/PageBreadcrumb';
import Spinner from 'src/components/spinner/Spinner';
import MessageForm from '../messageForm/MessageForm';
import MessageSentResult from '../messageSentResult/MessageSentResult';

import './MessageEdit.scss';

class MessageEdit extends React.Component {
  defaultData = {
    title: '',
    body: '',
    quickAction: 'ADD_CASH',
    type: 'CARD',
    sendTo: 'whole_universe',
    sampleSize: 0,
    priority: 0,
    recurrence: 'EVENT_DRIVEN',
    recurringMinIntervalDays: 0,
    recurringMaxInQueue: 0,
    eventTypeCategory: 'REFERRAL::REDEEMED::REFERRER',
    urlToVisit: ''
  };

  constructor(props) {
    super();

    this.state = {
      loading: false,
      mode: props.match.params.mode,
      formData: { ...this.defaultData },
      sentResult: null
    };

    this.messagesService = inject('MessagesService');
    this.historyService = inject('HistoryService');

    unmountDecorator(this);
  }

  componentDidMount() {
    this.loadMessage();
  }
  
  render() {
    const state = this.state;
    const title = capitalize(`${state.mode} message`);

    return <div className="message-edit">
      <PageBreadcrumb title={title} link={{ to: '/messages', text: 'Messages' }}/>
      <div className="page-content">
        {state.loading && <Spinner overlay/>}
        <MessageForm mode={state.mode} formData={state.formData}
          onChange={this.formInputChange} onSubmit={this.formSubmit}/>
      </div>
      {state.sentResult && <MessageSentResult {...state.sentResult}
          onAction={this.messageResultAction}/>}
    </div>;
  }

  messageResultAction = action => {
    if (action === 'close') {
      this.setState({ sentResult: null });
    } else if (action === 'create-new') {
      this.setState({ sentResult: null, formData: { ...this.defaultData } });
    } else if (action === 'go-to-home') {
      this.historyService.push('/');
    }
  }

  loadMessage() {
    if (this.state.mode === 'new') {
      return;
    }

    this.setState({ loading: true });

    const id = this.props.match.params.id;
    this.messagesService.getMessage(id).pipe(
      takeUntil(this.unmount)
    ).subscribe(message => {
      this.setState({
        formData: this.messageToFormData(message),
        loading: false
      });
    }, err => {
      console.error(err);
    });
  }

  formInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    });
  }

  formSubmit = event => {
    event.preventDefault();

    const mode = this.state.mode;

    if (mode === 'view') {
      this.setState({ mode: 'edit' });
      return;
    }

    const body = this.formDataToRequestBody();
    let obs;

    if (mode === 'edit') {
      const id = this.props.match.params.id;
      obs = this.messagesService.updateMessage(id, body);
    } else {
      // new or duplicate
      obs = this.messagesService.createMessage(body);
    }

    this.setState({ loading: true });

    obs.pipe(
      takeUntil(this.unmount)
    ).subscribe(() => {
      if (mode === 'new') {
        this.setState({ loading: false, sentResult: { success: true } });
      } else {
        this.historyService.push('/messages');
      }
    }, () => {
      if (mode === 'new') {
        this.setState({ loading: false, sentResult: { success: false } });
      } else {
        this.historyService.push('/messages');
      }
    });
  }

  formDataToRequestBody() {
    const data = this.state.formData;

    const body = {
      audienceType: 'GROUP',
      templates: {
        template: {
          DEFAULT: {
            title: data.title,
            body: data.body,
            display: { type: data.type },
            actionToTake: data.quickAction,
            urlToVisit: data.urlToVisit
          }
        }
      },
      messagePriority: parseInt(data.priority),
      presentationType: data.recurrence
    };

    if (data.recurrence === 'RECURRING') {
      body.recurrenceParameters = {
        minIntervalDays: data.recurringMinIntervalDays,
        maxInQueue: data.recurringMaxInQueue
      };
    } else if (data.recurrence === 'EVENT_DRIVEN') {
      if (this.state.mode === 'edit') {
        body.flags = [data.eventTypeCategory];
      } else {
        body.eventTypeCategory = data.eventTypeCategory;
      }
    }

    let selectionMethod = data.sendTo;
    if (selectionMethod === 'random_sample') {
      selectionMethod += ` #{${data.sampleSize / 100}}`;
    }

    body.selectionInstruction = `${selectionMethod} from #{{"client_id":"za_client_co"}}`;

    return body;
  }

  messageToFormData(message) {
    const defaultTemplate = message.templates.template.DEFAULT;
    const recurrenceParameters = message.recurrenceParameters;

    const data = {
      title: defaultTemplate.title,
      body: defaultTemplate.body,
      quickAction: defaultTemplate.actionToTake,
      type: defaultTemplate.display.type,
      priority: message.messagePriority,
      recurrence: message.presentationType,
      recurringMinIntervalDays: recurrenceParameters ? recurrenceParameters.minIntervalDays : 0,
      recurringMaxInQueue: recurrenceParameters ? recurrenceParameters.maxInQueue : 0,
      eventTypeCategory: message.flags ? message.flags[0] : '',
      urlToVisit: defaultTemplate.urlToVisit
    };

    if (message.selectionInstruction) {
      const match = message.selectionInstruction.match(/(whole_universe|random_sample)(?:\s#\{([\d.]+)\})?/);
      if (match) {
        data.sendTo = match[1];
        data.sampleSize = match[2] ? match[2] * 100 : 0
      }
    }

    return data;
  }
}

export default MessageEdit;