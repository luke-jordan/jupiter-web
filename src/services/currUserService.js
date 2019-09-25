export class CurrUserService {
  constructor () {
    this.key = 'currentUser';
    this.user = this.getUser();
  }

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.key));
    } catch {
      return null;
    }
  }

  setUser(user) {
    this.user = {
      token: user.token,
      profile: user.profile,
      systemWideUserId: user.systemWideUserId
    };
    localStorage.setItem(this.key, JSON.stringify(this.user));
  }

  removeUser() {
    this.user = null;
    localStorage.removeItem(this.key);
  }
}
