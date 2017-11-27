export {default as Fetcher} from './Fetcher'
export {default as Settings} from './Settings'
export {fetcher, stringifyQuery, parseQuery} from './utils/fetcher'
export {fetcher as default} from './utils/fetcher'
export {
    plugToRequest as plugCookieToRequest
} from './utils/cookies'
export {
    isAuthenticated,
    logout,
    setToken,
    getToken,
    setRefreshToken,
    getRefreshToken,
    setTokenName,
    setRefreshTokenName,
    setTokenPrefix,
    getTokenPrefix,
    setBaseUrl,
    getBaseUrl,
    cookies
} from './utils/settings'