import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { convertAmount, getCountryByCode, formatMoney } from 'src/core/utils';

export class ClientsService {
  constructor(apiService, dataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getClients() {
    return forkJoin(
      this.apiService.get(`${this.url}/client/list`, { sendToken: true }),
      this.dataService.getCountries()
    ).pipe(
      map(res => {
        const [clientsMap, countries] = res;

        const clients = Object.keys(clientsMap).map(id => {
          clientsMap[id].clientId = id;
          return clientsMap[id];
        });

        clients.forEach(client => {
          this._modifyClient(client, countries);
          client.floats.forEach(float => this._modifyFloat(float));
        });
        
        return clients;
      })
    );
  }

  _modifyClient(client, countries) {
    const country = getCountryByCode(countries, client.countryCode);
    client.countryName = country ? country.name : '';
  }

  _modifyFloat(float) {
    const {
      floatBalance, floatMonthGrowth,
      bonusPoolBalance, bonusInflowSum, bonusOutflow
    } = float;

    floatBalance.amountValue = convertAmount(floatBalance.amount, floatBalance.unit);
    floatBalance.amountMoney = formatMoney(floatBalance.amountValue, floatBalance.currency);

    floatMonthGrowth.amountValue = convertAmount(floatMonthGrowth.amount, floatMonthGrowth.unit);
    floatMonthGrowth.amountMoney = formatMoney(floatMonthGrowth.amountValue, floatMonthGrowth.currency);

    bonusPoolBalance.amountValue = convertAmount(bonusPoolBalance.amount, bonusPoolBalance.unit);
    bonusPoolBalance.amountMoney = formatMoney(bonusPoolBalance.amountValue, bonusPoolBalance.currency);

    bonusInflowSum.amountValue = convertAmount(bonusInflowSum.amount, bonusInflowSum.unit);
    bonusInflowSum.amountMoney = formatMoney(bonusInflowSum.amountValue, bonusInflowSum.currency);

    bonusOutflow.amountValue = convertAmount(bonusOutflow.amount, bonusOutflow.unit);
    bonusOutflow.amountMoney = formatMoney(bonusOutflow.amountValue, bonusOutflow.currency);
  }
}