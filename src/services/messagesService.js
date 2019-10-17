import { map, tap } from 'rxjs/operators';
import moment from 'moment';

export class MessagesService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getMessages(params) {
    return this.apiService.get(`${this.url}/message/instruct/list`, {
      sendToken: true, params
    }).pipe(
      tap(messages => {
        messages.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        messages.forEach(this._modifyMessage);
      })
    );
  }

  getMessage(id) {
    return this.getMessages().pipe(
      map(messages => messages.find(msg => msg.instructionId === id))
    );
  }

  getActiveMessagesCount() {
    return this.getMessages().pipe(
      map(res => res.length)
    );
  }

  updateMessage(instructionId, updateValues) {
    return this.apiService.post(`${this.url}/message/instruct/update`, {
      instructionId, updateValues
    }, {
      sendToken: true
    });
  }

  createMessage(data) {
    return this.apiService.post(`${this.url}/message/instruct/create`, data, {
      sendToken: true
    });
  }

  _modifyMessage = (message) => {
    message.presentationTypeText = {
      RECURRING: 'Recurring',
      EVENT_DRIVEN: 'Event-Driven',
      ONCE_OFF: 'Once-Off'
    }[message.presentationType] || '';

    message.displayTypeText = {
      CARD: 'Card',
      MODAL: 'Modal',
      PUSH: 'Push notification',
      EMAIL: 'Email'
    }[message.templates.template.DEFAULT.display.type] || '';

    message.startTimeText = moment(message.startTime).format('DD/MM/YY hh:mmA');

    const endTime = moment(message.endTime);
    message.endTimeText = endTime.isAfter(moment().add(10, 'years')) ? '--' : endTime.format('DD/MM/YY hh:mmA');
  }
}