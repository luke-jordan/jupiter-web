import { mergeMap, map } from 'rxjs/operators';

import { convertAmount, getCountryByCode, formatMoney } from 'utils';

export class ClientsService {
  constructor(apiService, dataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getClients() {
    return this.apiService.get(`${this.url}/client/list`, {
      sendToken: true
    }).pipe(
      mergeMap(this._modifyClients)
    );
  }

  _modifyClients = clients => {
    return this.dataService.getCountries().pipe(
      map(countries => {
        Object.keys(clients).forEach(id => {
          const client = clients[id];

          const country = getCountryByCode(countries, client.countryCode);
          client.countryName = country ? country.name : '';

          client.floats.forEach(float => {
            const { floatBalance, bonusPoolBalance } = float;

            floatBalance.amountValue = convertAmount(floatBalance.amount, floatBalance.unit);
            floatBalance.amountMoney = formatMoney(floatBalance.amountValue, floatBalance.currency);

            bonusPoolBalance.amountValue = convertAmount(bonusPoolBalance.amount, bonusPoolBalance.unit);
            bonusPoolBalance.amountMoney = formatMoney(bonusPoolBalance.amountValue, bonusPoolBalance.currency);
          });
        });
        return clients;
      })
    );
  }
}