import { ajax, AjaxError } from 'rxjs/ajax';
import { map, tap } from 'rxjs/operators';

import { inject } from 'src/core/utils';

export class ApiService {
  defaultOptions = {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    sendToken: true,
    convertBodyToJson: true,
    fullResponse: false,
    forceRelogin: true
  };

  get authService() {
    // use 'inject' here to avoid circular dependency
    // (because AuthService depends on ApiService)
    return inject('AuthService');
  }

  get(url, options) {
    return this.request({ method: 'get', url, ...options });
  }

  post(url, body, options) {
    return this.request({ method: 'POST', url, body, ...options });
  }

  patch(url, body, options) {
    return this.request({ method: 'patch', url, body, ...options });
  }

  put(url, body, options) {
    return this.request({ method: 'put', url, body, ...options });
  }

  delete(url, body, options) {
    return this.request({ method: 'delete', url, body, ...options });
  }

  request(options) {
    options = Object.assign({}, this.defaultOptions, options);
    options.headers = Object.assign({}, options.headers);

    const user = this.authService.user.value;

    if (options.sendToken && user) {
      options.headers['Authorization'] = `Bearer ${user.token}`;
    }

    if (options.convertBodyToJson) {
      options.body = JSON.stringify(options.body);
    }

    if (options.params) {
      options.url += `?${new URLSearchParams(options.params)}`;
    }

    return ajax(options).pipe(
      tap({
        error: err => this.errorHandler(err, options)
      }),
      map(res => {
        return options.fullResponse ? res : res.response;
      })
    );
  }

  errorHandler(err, options) {
    // Logout and redirect user to login page if request fails with status 401 or 403
    if (
      options.forceRelogin && err instanceof AjaxError && [401, 403].includes(err.status)
    ) {
      console.log('Force relogin');
      this.authService.logout().subscribe();
    }
  }
}
