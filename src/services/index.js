import Bottle from 'bottlejs';
import { createBrowserHistory } from 'history';

import { ApiService } from './apiService';
import { AuthService } from './authService';
import { UsersService } from './usersService';

// register services
const bottle = new Bottle();
bottle.service('ApiService', ApiService);
bottle.service('AuthService', AuthService, 'ApiService', 'HistoryService');
bottle.service('HistoryService', createBrowserHistory);
bottle.service('UsersService', UsersService, 'ApiService');

// inject returns instance of the service
export const inject = className => {
  if (className in bottle.container) {
    return bottle.container[className];
  } else {
    throw new Error(`Cannot inject ${className}`);
  }
};
