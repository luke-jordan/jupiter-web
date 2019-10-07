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
      tap(messages => messages.forEach(this._modifyMessage))
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

  _modifyMessage = (message) => {
    message.presentationTypeName = {
      RECURRING: 'Recurring',
      EVENT_DRIVEN: 'Event-Driven',
      ONCE_OFF: 'Once-Off'
    }[message.presentationType] || '';

    message.format = {
      CARD: 'Card',
      MODAL: 'Modal',
      PUSH: 'Push notification'
    }[message.templates.template.DEFAULT.display.type] || '';

    message.displayStartTime = moment(message.startTime).format('DD/MM/YY hh:mmA');

    const endTime = moment(message.endTime);
    message.displayEndTime = endTime.isAfter(moment().add(10, 'years')) ? '--' : endTime.format('DD/MM/YY hh:mmA');
  }
}