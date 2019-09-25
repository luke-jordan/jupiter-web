import Bottle from 'bottlejs';

import { ApiService } from './apiService';
import { AuthService } from './authService';

// register services
const bottle = new Bottle();
bottle.service('apiService', ApiService);
bottle.service('authService', AuthService, 'apiService');

// export instances
const container = bottle.container;
export const apiService = container.apiService;
export const authService = container.authService;
