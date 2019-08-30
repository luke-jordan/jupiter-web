import { authenticationService } from '../services/authentication.service';

export const authHeader = () => {
    const currentUser = authenticationService.currentUserValue;
    if (currentUser && currentUser.token) {
        // console.log('Returning header! : ', currentUser.token);
        return { Authorization: `Bearer ${currentUser.token}` };
    } else  {
        return { };
    }
}