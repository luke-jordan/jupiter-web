import { map } from 'rxjs/operators';

export class MessagesService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getActiveMessages() {
    return this.apiService.get(`${this.url}/message/instruct/list`, {
      sendToken: true
    }).pipe(
      map(res => res.length)
    );
  }
}