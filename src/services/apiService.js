import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

import { inject } from 'src/utils';

export class ApiService {
  defaultOptions = {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    sendToken: false,
    convertBodyToJson: true,
    fullResponse: false
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
      map(res => {
        return options.fullResponse ? res : res.response;
      })
    );
  }
}
