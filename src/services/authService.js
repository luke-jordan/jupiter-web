import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export class AuthService {
  userKey = 'currentUser';

  constructor(apiService, historyService) {
    this.apiService = apiService;
    this.historyService = historyService;
    this.url = process.env.REACT_APP_AUTH_URL;

    this._getCurrentUser();
    this.user$ = new BehaviorSubject(this.user);
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
      this.user = JSON.parse(localStorage.getItem(this.userKey));
    } catch {
      this.user = null;
    }
  }

  _setCurrentUser(data) {
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

    this.user$.next(this.user);
  }
}
