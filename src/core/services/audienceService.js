export class AudienceService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getProperties() {
    return this.apiService.get(`${this.url}/audience/properties`);
  }

  getPreview(data) {
    return this.apiService.post(`${this.url}/audience/preview`, data);
  }

  createAudience(data) {
    return this.apiService.post(`${this.url}/audience/create`, data);
  }
}
