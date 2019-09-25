import Bottle from 'bottlejs';

import { CurrUserService } from './currUserService';
import { ApiService } from './apiService';
import { AuthService } from './authService';

// register services
const bottle = new Bottle();
bottle.service('currUserService', CurrUserService);
bottle.service('apiService', ApiService, 'currUserService');
bottle.service('authService', AuthService, 'currUserService', 'apiService');

// export instances
const container = bottle.container;
export const currUserService = container.currUserService;
export const apiService = container.apiService;
export const authService = container.authService;
