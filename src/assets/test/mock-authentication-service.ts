export { AuthenticationService } from './../../app/security/authentication.service';
export const MockAuthenticationService = {
    revokeAuthentication: () => { sessionStorage.clear(); },
    getClientIdSecret: () => {},
    login: () => {},
    processToken : () => {},
    getAuthentication: () => {},
    isAuthenticated: () => {}
};
