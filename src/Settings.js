import {set, get, remove} from './utils/cookies'


class Settings {
    constructor({token = 'token', refreshToken = 'refreshToken', tokenPrefix = 'Bearer ', baseUrl = ''} = {}) {
        this.setTokenName(token)
        this.setRefreshTokenName(refreshToken)
        this.setTokenPrefix(tokenPrefix)
        this.setBaseUrl(baseUrl)
    }

    isAuthenticated = () => !!this.getToken()

    logout = () => {
        this.setToken(null)
        this.setRefreshToken(null)
    }

    setToken = (token, options = {}) =>
        !token ?
            remove(this.tokenName, options) :
            set(this.tokenName, token, options)


    getToken = () => get(this.tokenName)

    setRefreshToken = (refreshToken, options = {}) =>
        !refreshToken ?
            remove(this.refreshTokenName, options) :
            set(this.refreshTokenName, refreshToken)

    getRefreshToken = () => get(this.refreshTokenName)

    setTokenName = tokenName => {
        this.tokenName = tokenName
    }

    setRefreshTokenName = refreshTokenName => {
        this.refreshTokenName = refreshTokenName
    }

    setTokenPrefix = tokenPrefix => {
        this.tokenPrefix = tokenPrefix
    }

    getTokenPrefix = () => this.tokenPrefix

    setBaseUrl = baseUrl => {
        this.baseUrl = baseUrl
    }

    getBaseUrl = () => this.baseUrl
}


export {
    Settings as default
}
