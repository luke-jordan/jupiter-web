import { map } from 'rxjs/operators';

export class BoostsService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getBoosts(params) {
    return this.apiService.get(`${this.url}/boost/list`, {
      sendToken: true, params
    });
  }

  getActiveBoostsCount() {
    return this.getBoosts().pipe(
      map(res => res.length)
    );
  }
}