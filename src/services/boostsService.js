import { tap, map } from 'rxjs/operators';
import moment from 'moment';

import { convertAmount, formatMoney } from 'utils';

export class BoostsService {
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

  _modifyBoost = (boost) => {
    boost.boostTypeText = {
      GAME: 'Game',
      SIMPLE: 'Simple'
    }[boost.boostType];

    boost.boostCategoryText = {
      TIME_LIMITED: 'Time limited'
    }[boost.boostCategory];

    boost.startTimeText = moment(boost.startTime).format('DD/MM/YY hh:mmA');

    const endTime = moment(boost.endTime);
    boost.endTimeText = endTime.isAfter(moment().add(10, 'years')) ? '--' : endTime.format('DD/MM/YY hh:mmA');

    boost.boostBudgetValue = convertAmount(boost.boostBudget, boost.boostUnit);
    boost.boostBudgetMoney = formatMoney(boost.boostBudgetValue, boost.boostCurrency);

    boost.boostRedeemedValue = convertAmount(boost.boostRedeemed, boost.boostUnit);
    boost.boostRedeemedMoney = formatMoney(boost.boostRedeemedValue, boost.boostCurrency);
  }
}