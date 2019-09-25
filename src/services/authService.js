export class AuthService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_AUTH_URL;
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data);
  }
}
