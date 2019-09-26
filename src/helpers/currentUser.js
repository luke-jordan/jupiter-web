class CurrentUser {
  key = 'currentUser';

  constructor() {
    try {
      this.user = JSON.parse(localStorage.getItem(this.key));
    } catch {
      this.user = null;
    }
  }

  updateUser(data) {
    if (data) {
      this.user = {
        token: data.token,
        profile: data.profile,
        systemWideUserId: data.systemWideUserId
      };
      localStorage.setItem(this.key, JSON.stringify(this.user));
    } else {
      this.user = null;
      localStorage.removeItem(this.key);
    }

    return this.user;
  }
}

export const currentUser = new CurrentUser();
