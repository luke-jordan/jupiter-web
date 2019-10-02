import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AuthService {
  userKey = 'currentUser';

  constructor(apiService, historyService) {
    this.apiService = apiService;
    this.historyService = historyService;
    this.url = process.env.REACT_APP_AUTH_URL;

    this._getUser();
    this.currUser = new BehaviorSubject(this.user);
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data).pipe(
      tap(res => {
        if (res.result !== 'OTP_NEEDED') {
          // login success
          this._setUser(res);
          this.historyService.push('/');
        }
      })
    );
  }

  logout() {
    this._setUser(null);
    this.historyService.push('/login');
    return of(null);
  }

  _getUser() {
    try {
      this.user = JSON.parse(localStorage.getItem(this.userKey));
    } catch {
      this.user = null;
    }
  }

  _setUser(data) {
    if (data) {
      this.user = {
        token: data.token,
        profile: data.profile,
        systemWideUserId: data.systemWideUserId
      };
      localStorage.setItem(this.userKey, JSON.stringify(this.user));
    } else {
      this.user = null;
      localStorage.removeItem(this.userKey);
    }

    this.currUser.next(this.user);
  }
}
