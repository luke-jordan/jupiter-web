import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import moment from 'moment';

import { convertAmount, formatMoney } from 'src/core/utils';

export class BoostsService {
  boostTypes = {
    GAME: 'Game',
    SIMPLE: 'Simple'
  };

  boostCategories = {
    TIME_LIMITED: 'Time limited'
  };

  constructor(apiService) {
    this.apiService = apiService;
    this.url = process.env.REACT_APP_ADMIN_URL;
  }

  getBoosts(params) {
    return this.apiService.get(`${this.url}/boost/list`, {
      sendToken: true, params
    }).pipe(
      tap(boosts => boosts.forEach(this._modifyBoost))
    );
  }

  getActiveBoostsCount() {
    return this.getBoosts().pipe(
      map(res => res.length)
    );
  }

  createBoost(data) {
    return this.apiService.post(`${this.url}/boost/create`, data, {
      sendToken: true
    });
  }

  updateBoost(boostId, updateValues) {
    // boost update is not implemented yet
    return of(null);
  }

  _modifyBoost = (boost) => {
    boost.boostTypeText = this.boostTypes[boost.boostType] || boost.boostType;
    boost.boostCategoryText = this.boostCategories[boost.boostCategory] || boost.boostCategory;

    boost.formattedStartDate = moment(boost.startTime).format('DD/MM/YY hh:mmA');

    const endDate = moment(boost.endTime);
    boost.formattedEndDate = endDate.isAfter(moment().add(10, 'years')) ? '--' : endDate.format('DD/MM/YY hh:mmA');

    boost.boostBudgetValue = convertAmount(boost.boostBudget, boost.boostUnit);
    boost.boostBudgetMoney = formatMoney(boost.boostBudgetValue, boost.boostCurrency);

    boost.boostRedeemedValue = convertAmount(boost.boostRedeemed, boost.boostUnit);
    boost.boostRedeemedMoney = formatMoney(boost.boostRedeemedValue, boost.boostCurrency);
  }
}