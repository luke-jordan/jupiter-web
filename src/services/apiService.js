import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';

import { currentUser } from 'helpers/currentUser';

export class ApiService {
  defaultOptions = {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    },
    sendToken: false,
    convertBodyToJson: true,
    fullResponse: false
  };

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

    if (options.sendToken && currentUser.user) {
      options.headers['Authorization'] = `Bearer ${currentUser.user.token}`;
    }

    if (options.convertBodyToJson) {
      options.body = JSON.stringify(options.body);
    }

    return ajax(options).pipe(
      map(res => {
        return options.fullResponse ? res : res.response;
      })
    );
  }
}
