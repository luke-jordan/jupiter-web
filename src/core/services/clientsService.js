import { forkJoin, of } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
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
    return forkJoin(
      this.apiService.get(`${this.url}/client/list`),
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
      params: { clientId, floatId }
    }).pipe(
      tap(float => {
        this._modifyFloat(float);
        float.floatAlerts.forEach(floatAlert => this._modifyAlert(floatAlert));
        float.referralCodes.forEach(referralCode => this._modifyReferralCode(referralCode));
      })
    );
  }

  updateClient(data) {
    return this.apiService.post(`${this.url}/client/edit`, data);
  }

  updateComparatorRates(data) {
    return this.apiService.post(`${this.url}/client/comparators`, data);
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

  previewCapitalizeInterest() {
    const transactions = [];
    for (let i = 0; i < 10; ++i) {
      transactions.push({
        id: i,
        accountName: `Account ${i+1}`,
        priorBalance: i+100,
        priorAccrued: i+200,
        amountToCredit: i+300
      });
    }

    return of({
      numberAccountsToBeCredited: 10,
      amountToCreditClient: 500,
      amountToCreditBonusPool: 8774,
      excessOverPastAccrual: 3889,
      unit: 'WHOLE_CENT',
      currency: 'ZAR',
      sampleOfTransactions: transactions
    }).pipe(
      delay(500),
      tap(res => this._modifyInterestPreview(res))
    );
  }

  confirmCapitalizeInterest() {
    return of(null).pipe(delay(500));
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

  _modifyInterestPreview(preview) {
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