import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { currentUser } from 'helpers/currentUser';

export class AuthService {
  constructor(apiService, historyService) {
    this.apiService = apiService;
    this.historyService = historyService;
    this.url = process.env.REACT_APP_AUTH_URL;
    this.user = new BehaviorSubject(currentUser.user);
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data).pipe(
      tap(res => {
        if (res.result !== 'OTP_NEEDED') {
          // login success
          this.user.next(currentUser.updateUser(res));
          this.historyService.push('/');
        }
      })
    );
  }

  logout() {
    this.user.next(currentUser.updateUser(null));
    this.historyService.push('/login');
    return of(null);
  }
}
