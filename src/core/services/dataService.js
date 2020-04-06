import { of } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

export class DataService {
  getCountries() {
    if (this._countries) {
      return of(this._countries);
    }
    
    if (this._countriesObs) {
      return this._countriesObs;
    }

    this._countriesObs = ajax.getJSON('/data/countries.min.json').pipe(
      map(res => {
        this._countries = res;
        this._countriesObs = null;
        return this._countries;
      }),
      share()
    );
    return this._countriesObs;
  }

  getUserEvents() {
    return [
      'USER_REGISTERED',
      'PASSWORD_SET',
      'USER_LOGIN',
      'STATUS_CHANGED',
      'SAVING_EVENT_INITIATED',
      'SAVING_EVENT_PAYMENT_CHECK',
      'SAVING_PAYMENT_SUCCESSFUL',
      'SAVING_EVENT_CANCELLED',
      'WITHDRAWAL_EVENT_CONFIRMED',
      'WITHDRAWAL_EVENT_CANCELLED',
      'WITHDRAWAL_COMPLETED',
      'USER_CREATED_ACCOUNT',
      'BOOST_REDEEMED',
      'USER_GAME_COMPLETION',
      'MESSAGE_PUSH_NOTIFICATION_SENT',
      'MESSAGE_CREATED',
      'MESSAGE_FETCHED'
    ]
  }
}