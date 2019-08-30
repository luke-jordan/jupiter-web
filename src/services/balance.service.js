import { authHeader } from '../helpers/auth-header';
import { handleResponse } from '../helpers/response-handler';

const fetchOwnBalance = () => {
     const requestOptions = { method: 'GET', headers: authHeader() };
    //  console.log('Request header: ', requestOptions.headers);
     return fetch('https://staging.jupiterapp.net/balance', requestOptions).then(handleResponse);
}

export const balanceService = {
    fetchOwnBalance
};