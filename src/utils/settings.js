import Settings from '../Settings'


const settings = new Settings()

export const {
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
    cookies,
    setOnFail
} = settings

export default settings