import { of } from 'rxjs';

export class AudienceService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getProperties() {
    return of([
      {
        "name": "saveCount",
        "type": "aggregate",
        "description": "Number of saves",
        "expects": "number"
      },
      {
        "name": "lastSaveTime",
        "type": "match",
        "description": "Last save date",
        "expects": "epochMillis"
      }
    ]);
    // return this.apiService.get(`${this.url}/audience/properties`, {
    //   sendToken: true
    // });
  }

  getPreview(data) {
    return this.apiService.post(`${this.url}/audience/preview`, data, {
      sendToken: true
    });
  }
}
