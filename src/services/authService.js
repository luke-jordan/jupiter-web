import { tap } from 'rxjs/operators';

export class AuthService {
  constructor(currUserService, apiService) {
    this.currUserService = currUserService;
    this.apiService = apiService;
    this.url = process.env.REACT_APP_AUTH_URL;
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data).pipe(
      tap(user => {
        if (user.result !== 'OTP_NEEDED') {
          this.currUserService.setUser(user);
        }
      })
    )
  }

  logout() {
    this.currUserService.removeUser();
  }
}
