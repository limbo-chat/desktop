import { PROTOCOL } from "../constants";

export const AUTH_REDIRECT_URI = `${PROTOCOL}://auth/callback`;
export const TOKEN_REFRESH_THRESHOLD_MINUTES = 5; // how long before expiration to refresh the token
