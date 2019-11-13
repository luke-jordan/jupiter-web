export class AudienceService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getProperties() {
    return this.apiService.get(`${this.url}/audience/properties`, {
      sendToken: true
    });
  }

  getPreview(data) {
    return this.apiService.post(`${this.url}/audience/preview`, data, {
      sendToken: true
    });
  }

  createAudience(data) {
    return this.apiService.post(`${this.url}/audience/create`, data, {
      sendToken: true
    });
  }
}
