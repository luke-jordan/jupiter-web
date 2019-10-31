import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

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

  getFloat(clientId, floatId) {
    return this.apiService.get(`${this.url}/client/fetch`, {
      params: { clientId, floatId }, sendToken: true
    }).pipe(
      tap(float => {
        this._modifyFloat(float);
        float.floatAlerts.forEach(floatAlert => this._modifyAlert(floatAlert));
      })
    );
  }

  updateClient(data) {
    return this.apiService.post(`${this.url}/client/edit`, data, {
      sendToken: true
    });
  }

  updateFloatAccrual(clientId, floatId, changes, reason) {
    return this.updateClient({
      clientId, floatId,
      newAccrualVars: changes,
      operation: 'ADJUST_ACCRUAL_VARS',
      reasonToLog: reason
    });
  }

  updateFloatBalance({ clientId, floatId, amount, currency, unit }) {
    return this.updateClient({
      clientId, floatId,
      operation: 'ADD_SUBTRACT_FUNDS',
      amountToProcess: { amount, currency, unit }
    });
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

    if (float.floatMonthGrowth) {
      floatMonthGrowth.amountValue = convertAmount(floatMonthGrowth.amount, floatMonthGrowth.unit);
      floatMonthGrowth.amountMoney = formatMoney(floatMonthGrowth.amountValue, floatMonthGrowth.currency);
    }

    if (bonusPoolBalance) {
      bonusPoolBalance.amountValue = convertAmount(bonusPoolBalance.amount, bonusPoolBalance.unit);
      bonusPoolBalance.amountMoney = formatMoney(bonusPoolBalance.amountValue, bonusPoolBalance.currency);
    }

    if (bonusInflowSum) {
      bonusInflowSum.amountValue = convertAmount(bonusInflowSum.amount, bonusInflowSum.unit);
      bonusInflowSum.amountMoney = formatMoney(bonusInflowSum.amountValue, bonusInflowSum.currency);
    }

    if (bonusOutflow) {
      bonusOutflow.amountValue = convertAmount(bonusOutflow.amount, bonusOutflow.unit);
      bonusOutflow.amountMoney = formatMoney(bonusOutflow.amountValue, bonusOutflow.currency);
    }
  }

  _modifyAlert(floatAlert) {
    floatAlert.formattedDate = moment(floatAlert.updatedTimeMillis).format('DD/MM/YY hh:mmA');
  }
}