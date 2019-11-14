import { of } from 'rxjs';
import { tap, map, mergeMap } from 'rxjs/operators';
import moment from 'moment';

import { convertAmount, formatMoney } from 'src/core/utils';
import { boostTypeMap, boostCategoryMap } from 'src/core/constants';

export class BoostsService {
  constructor(apiService, audienceService) {
    this.apiService = apiService;
    this.audienceService = audienceService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getBoosts(params) {
    return this.apiService.get(`${this.url}/boost/list`, {
      sendToken: true, params
    }).pipe(
      tap(boosts => boosts.forEach(this._modifyBoost))
    );
  }

  getBoost(id) {
    return this.getBoosts().pipe(
      map(boosts => boosts.find(boost => boost.boostId === id))
    );
  }

  getActiveBoostsCount() {
    return this.getBoosts().pipe(
      map(res => res.length)
    );
  }

  createBoost(boostData, audienceData) {
    const audienceObs = audienceData ?
      this.audienceService.createAudience(audienceData).pipe(
        tap(res => boostData.audienceId = res.audienceId)
      ) : of(null);

    return audienceObs.pipe(
      mergeMap(() => this.apiService.post(`${this.url}/boost/create`, boostData, { sendToken: true }))
    );
  }

  _modifyBoost = (boost) => {
    boost.boostTypeText = boostTypeMap[boost.boostType] || boost.boostType;
    boost.boostCategoryText = boostCategoryMap[boost.boostCategory] || boost.boostCategory;

    boost.formattedStartDate = moment(boost.startTime).format('DD/MM/YY hh:mmA');

    const endDate = moment(boost.endTime);
    boost.formattedEndDate = endDate.isAfter(moment().add(10, 'years')) ? '--' : endDate.format('DD/MM/YY hh:mmA');

    boost.boostBudgetValue = convertAmount(boost.boostBudget, boost.boostUnit);
    boost.boostBudgetMoney = formatMoney(boost.boostBudgetValue, boost.boostCurrency);

    boost.boostRedeemedValue = convertAmount(boost.boostRedeemed, boost.boostUnit);
    boost.boostRedeemedMoney = formatMoney(boost.boostRedeemedValue, boost.boostCurrency);
  }
}