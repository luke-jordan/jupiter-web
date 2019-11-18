import { of } from 'rxjs';
import { map, tap, mergeMap } from 'rxjs/operators';
import moment from 'moment';

import { messagePresentationTypeMap, messageDisplayTypeMap } from 'src/core/constants';

export class MessagesService {
  constructor(apiService, audienceService) {
    this.apiService = apiService;
    this.audienceService = audienceService;
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

  createMessage(messageData, audienceData) {
    const audienceObs = audienceData ?
      this.audienceService.createAudience(audienceData).pipe(
        tap(res => messageData.audienceId = res.audienceId)
      ) : of(null);

    return audienceObs.pipe(
      mergeMap(() => this.apiService.post(`${this.url}/message/instruct/create`, messageData, { sendToken: true }))
    );
  }

  filterMessages(allMessages, filter) {
    const priority = filter.priority.split('-');
    return allMessages.filter(message => {
      return (
        (!filter.type.length || filter.type.includes(message.presentationType)) &&
        (!filter.format.length || filter.format.includes(message.templates.template.DEFAULT.display.type)) &&
        (!filter.priority || (message.messagePriority >= priority[0] && message.messagePriority <= priority[1])) &&
        (!filter.startDate || moment(message.startTime).isSame(filter.startDate, 'day'))
      );
    });
  }

  _modifyMessage = (message) => {
    message.presentationTypeText = messagePresentationTypeMap[message.presentationType] || message.presentationType;

    const displayType = message.templates.template.DEFAULT.display.type;
    message.displayTypeText = messageDisplayTypeMap[displayType] || displayType;

    message.formattedStartDate = moment(message.startTime).format('DD/MM/YY hh:mmA');

    const endDate = moment(message.endTime);
    message.formattedEndDate = endDate.isAfter(moment().add(10, 'years')) ? '--' : endDate.format('DD/MM/YY hh:mmA');
  }
}