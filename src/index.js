export {default as Fetcher} from './Fetcher'
export {default as Settings} from './Settings'
export {fetcher, stringify, parse} from './utils/fetcher'
export {fetcher as default} from './utils/fetcher'
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
    getBaseUrl
} from './utils/settings'
