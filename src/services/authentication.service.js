import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const login = (phoneOrEmail, password) => {
    const requestOptions = {
        method: 'post',
        body: JSON.stringify({ phoneOrEmail, password })
    };

    return fetch('https://staging-auth.jupiterapp.net/login', requestOptions)
        .then((loginResponse) => {
            console.log('Received login response: ', loginResponse);
            return loginResponse.json();
        })
        .then((responseBody) => {
            const currentUser = { 
                systemWideUserId: responseBody.systemWideUserId,
                token: responseBody.token,
                profile: responseBody.profile
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            currentUserSubject.next(currentUser);
        });
};

const logout = () => {
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
};

export const authenticationService = {
    login, 
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};