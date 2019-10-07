import { map } from 'rxjs/operators';

import { convertAmount } from 'utils';

export class ClientsService {
  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getClients() {
    return this.apiService.get(`${this.url}/client/list`, {
      sendToken: true
    }).pipe(
      map(this._modifyClients)
    )
  }

  _modifyClients = clients => {
    Object.keys(clients).forEach(id => {
      const client = clients[id];

      client.floats.forEach(float => {
        const { floatBalance, bonusPoolBalance } = float;
        floatBalance.amountValue = convertAmount(floatBalance.amount, floatBalance.unit);
        bonusPoolBalance.amountValue = convertAmount(bonusPoolBalance.amount, bonusPoolBalance.unit);
      });
    });
    return clients;
  }
}