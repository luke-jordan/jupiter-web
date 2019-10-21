import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AuthService {
  userKey = 'currentUser';

  constructor(apiService, historyService) {
    this.apiService = apiService;
    this.historyService = historyService;
    this.url = process.env.REACT_APP_AUTH_URL;

    this.user = new BehaviorSubject(this._getCurrentUser());
  }

  login(data) {
    return this.apiService.post(`${this.url}/login`, data).pipe(
      tap(res => {
        if (res.result !== 'OTP_NEEDED') {
          // login success
          this._setCurrentUser(res);
          this.historyService.push('/');
        }
      })
    );
  }

  logout() {
    return of(null).pipe(
      tap(() => {
        this._setCurrentUser(null);
        this.historyService.push('/login');
      })
    );
  }

  _getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(this.userKey));
    } catch {
      return null;
    }
  }

  _setCurrentUser(data) {
    if (data) {
      const user = {
        token: data.token,
        profile: data.profile,
        systemWideUserId: data.systemWideUserId
      };
      localStorage.setItem(this.userKey, JSON.stringify(user));
      this.user.next(user);
    } else {
      localStorage.removeItem(this.userKey);
      this.user.next(null);
    }
  }
}
