import Bottle from 'bottlejs';
import { createBrowserHistory } from 'history';

import { ApiService } from './apiService';
import { AuthService } from './authService';
import { UsersService } from './usersService';
import { BoostsService } from './boostsService';
import { MessagesService } from './messagesService';
import { ClientsService } from './clientsService';
import { DataService } from './dataService';
import { ModalService } from './modalService';
import { AudienceService } from './audienceService';

// register services
const bottle = new Bottle();
bottle.service('ApiService', ApiService);
bottle.service('AuthService', AuthService, 'ApiService', 'HistoryService');
bottle.service('HistoryService', createBrowserHistory);
bottle.service('UsersService', UsersService, 'ApiService');
bottle.service('BoostsService', BoostsService, 'ApiService');
bottle.service('MessagesService', MessagesService, 'ApiService');
bottle.service('ClientsService', ClientsService, 'ApiService', 'DataService');
bottle.service('DataService', DataService);
bottle.service('ModalService', ModalService);
bottle.service('AudienceService', AudienceService, 'ApiService');

export default bottle;