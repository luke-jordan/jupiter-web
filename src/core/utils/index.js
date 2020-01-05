import currency from 'currency.js';
import { Subject } from 'rxjs';

import bottle from 'src/core/services/bottle';

export const inject = className => {
  if (className in bottle.container) {
    return bottle.container[className];
  } else {
    throw new Error(`Cannot inject service "${className}"`);
  }
}

export const capitalize = str => {
  return str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : '';
}

export const convertAmount = (amount, unit) => {
  if (unit === 'WHOLE_CENT') {
    return amount / 100;
  } else if (unit === 'HUNDREDTH_CENT') {
    return amount / 10000;
  } else  {
    return +amount;
  }
}

export const formatMoney = (amount, currencyCode) => {
  const defaults = { formatWithSymbol: true, symbol: '' };
  const options = {
    USD: { symbol: '$' },
    EUR: { symbol: '€' },
    ZAR: { symbol: 'R' }
  };
  return currency(
    amount, Object.assign({}, defaults, options[currencyCode])
  ).format();
}

export const setAmountValueAndMoney = (obj, keys, unit, currency) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  keys.forEach(key => {
    if (!(key in obj)) {
      return;
    }

    const valueKey = `${key}Value`;
    const moneyKey = `${key}Money`;

    obj[valueKey] = convertAmount(obj[key], unit);
    obj[moneyKey] = formatMoney(obj[valueKey], currency);
  });
}

export const getCountryByCode = (countries, code) => {
  return countries.find(country => {
    return (country['alpha-2'] === code || country['alpha-3'] === code);
  });
}

export const unmountDecorator = (instance) => {
  if (instance.unmount) {
    throw Error('Unmount decorator can be applied only once');
  }

  const unmountFn = instance.componentWillUnmount;
  instance.unmount = new Subject();
  instance.componentWillUnmount = function() {
    if (unmountFn) {
      unmountFn.apply(this, arguments);
    }
    this.unmount.next();
    this.unmount.complete();
  }
}

export const tempStorage = {
  _map: new Map(),
  set: function(key, value) {
    this._map.set(key, value)
  },
  get: function(key) {
    const value = this._map.get(key);
    this._map.delete(key);
    return value;
  }
};

export const mapToOptions = mapObj => {
  return Object.entries(mapObj)
    .map(([value, text]) => ({ value, text }))
    .sort((a, b) => {
      if (a.text > b.text) {
        return 1;
      } else if (a.text < b.text) {
        return -1;
      } else {
        return 0;
      }
    });
};

export const deepCopy = value => {
  return JSON.parse(JSON.stringify(value));
}