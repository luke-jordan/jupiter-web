import { tap } from 'rxjs/operators';

export class AudienceService {
  periodProps = ['saveCount'];

  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getProperties() {
    return this.apiService.get(`${this.url}/audience/properties`).pipe(
      tap(res => {
        res.forEach(item => {
          item.period = this.periodProps.includes(item.name);
        })
      })
    );
  }

  getPreview(data) {
    return this.apiService.post(`${this.url}/audience/preview`, data);
  }

  createAudience(data) {
    return this.apiService.post(`${this.url}/audience/create`, data);
  }
}
