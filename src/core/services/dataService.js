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
}