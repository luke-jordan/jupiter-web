import { forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import moment from 'moment';

import { getCountryByCode, setAmountValueAndMoney } from 'src/core/utils';
import { referralCodeTypeMap } from 'src/core/constants';

export class ClientsService {
  constructor(apiService, dataService) {
    this.apiService = apiService;
    this.dataService = dataService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getClients() {
    return forkJoin([
      this.apiService.get(`${this.url}/client/list`),
      this.dataService.getCountries()
    ]).pipe(
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
      params: { clientId, floatId }
    }).pipe(
      tap(float => {
        this._modifyFloat(float);
        float.floatAlerts.forEach(floatAlert => this._modifyAlert(floatAlert));
        float.referralCodes.forEach(referralCode => this._modifyReferralCode(referralCode));
      })
    );
  }

  getHeatConfig(clientId, floatId) {
    const params = { clientId, floatId };
    return this.apiService.get(`${this.url}/heat/config`, { params });
  }

  updateClient(data) {
    return this.apiService.post(`${this.url}/client/edit`, data);
  }

  updateComparatorRates(data) {
    return this.apiService.post(`${this.url}/client/comparators`, data);
  }

  updateEventHeatPoints(data) {
    return this.apiService.post(`${this.url}/heat/edit/event`, data);
  }

  updateHeatLevels(data) {
    return this.apiService.post(`${this.url}/heat/edit/level`, data);
  }

  updateUserRefParams(data) {
    return this.apiService.post(`${this.url}/referral/user`, data);
  }

  createRefCode(data) {
    return this.apiService.post(`${this.url}/referral/create`, data).pipe(
      tap(res => {
        res.updatedCodes.forEach(referralCode => this._modifyReferralCode(referralCode))
      })
    );
  }

  updateRefCode(data) {
    return this.apiService.post(`${this.url}/referral/update`, data).pipe(
      tap(res => {
        // temporary add updated code to the result
        // TODO: remove when api will return updated code
        res.updatedCode = { ...data };
        this._modifyReferralCode(res.updatedCode);
      })
    );
  }

  checkRefCodeAvailable(params) {
    return this.apiService.get(`${this.url}/referral/available`, { params });
  }

  deactivateRefCode(data) {
    return this.apiService.post(`${this.url}/referral/deactivate`, data);
  }

  previewCapitalizeInterest(data) {
    return this.apiService.post(`${this.url}/client/capitalize/preview`, data).pipe(
      tap(res => this._modifyCapitalizeInterest(res))
    );
  }

  confirmCapitalizeInterest(data) {
    return this.apiService.post(`${this.url}/client/capitalize/confirm`, data);
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

    setAmountValueAndMoney(floatBalance, 'amount', floatBalance.unit, floatBalance.currency);

    if (floatMonthGrowth) {
      setAmountValueAndMoney(floatMonthGrowth, 'amount', floatMonthGrowth.unit, floatMonthGrowth.currency);
    }

    if (bonusPoolBalance) {
      setAmountValueAndMoney(bonusPoolBalance, 'amount', bonusPoolBalance.unit, bonusPoolBalance.currency);
    }

    if (bonusInflowSum) {
      setAmountValueAndMoney(bonusInflowSum, 'amount', bonusInflowSum.unit, bonusInflowSum.currency);
    }

    if (bonusOutflow) {
      setAmountValueAndMoney(bonusOutflow, 'amount', bonusOutflow.unit, bonusOutflow.currency);
    }
  }

  _modifyAlert(floatAlert) {
    floatAlert.formattedDate = moment(floatAlert.updatedTimeMillis).format('DD/MM/YY hh:mmA');

    if (floatAlert.logType === 'BALANCE_MISMATCH') {
      const context = floatAlert.logContext;
      setAmountValueAndMoney(context, [
        'floatAllocations', 'floatBalance', 'mismatch'
      ], context.unit, context.currency);
    }
  }

  _modifyReferralCode(referralCode) {
    referralCode.codeTypeText = referralCodeTypeMap[referralCode.codeType] || referralCode.codeType;

    const bonusAmount = referralCode.bonusAmount;
    setAmountValueAndMoney(bonusAmount, 'amount', bonusAmount.unit, bonusAmount.currency);
  }

  _modifyCapitalizeInterest(preview) {
    setAmountValueAndMoney(preview, [
      'amountToCreditClient', 'amountToCreditBonusPool', 'excessOverPastAccrual'
    ], preview.unit, preview.currency);

    preview.sampleOfTransactions.forEach(transaction => {
      setAmountValueAndMoney(transaction, [
        'priorBalance', 'priorAccrued', 'amountToCredit'
      ], preview.unit, preview.currency);
    });
  }
}