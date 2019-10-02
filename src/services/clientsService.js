export class ClientsService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getClients() {
    return this.apiService.get(`${this.url}/client/list`, {
      sendToken: true
    });
  }
}