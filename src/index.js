export {default as Fetcher} from './Fetcher'
export {default as Settings} from './Settings'
export {default as Cookies} from './Cookies'
export {fetcher, stringifyQuery, parseQuery} from './utils/fetcher'
export {fetcher as default} from './utils/fetcher'
export * as settings from './utils/settings'
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

