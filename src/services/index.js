import Bottle from 'bottlejs';
import { createBrowserHistory } from 'history';

import { ApiService } from './apiService';
import { AuthService } from './authService';

// register services
const bottle = new Bottle();
bottle.service('apiService', ApiService);
bottle.service('authService', AuthService, 'apiService', 'historyService');
bottle.service('historyService', createBrowserHistory);

// export instances
const container = bottle.container;
export const apiService = container.apiService;
export const authService = container.authService;
export const historyService = container.historyService;
