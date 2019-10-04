import { map } from 'rxjs/operators';

export class MessagesService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getMessages(params) {
    return this.apiService.get(`${this.url}/message/instruct/list`, {
      sendToken: true, params
    });
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
}