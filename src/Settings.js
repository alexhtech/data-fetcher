import * as cookiesDefault from './utils/cookies'


class Settings {
    constructor({
                    token = 'token',
                    refreshToken = 'refreshToken',
                    tokenPrefix = 'Bearer ',
                    baseUrl = ''
                } = {},
                cookies = cookiesDefault) {
        this.setTokenName(token)
        this.setRefreshTokenName(refreshToken)
        this.setTokenPrefix(tokenPrefix)
        this.setBaseUrl(baseUrl)
        this.cookies = cookies
    }

    isAuthenticated = () => !!this.getToken()

    logout = () => {
        this.setToken(null)
        this.setRefreshToken(null)
    }

    setToken = (token, options = {}) =>
        !token ?
            this.cookies.remove(this.tokenName, options) :
            this.cookies.set(this.tokenName, token, options)


    getToken = () => this.cookies.get(this.tokenName)

    setRefreshToken = (refreshToken, options = {}) =>
        !refreshToken ?
            this.cookies.remove(this.refreshTokenName, options) :
            this.cookies.set(this.refreshTokenName, refreshToken)

    getRefreshToken = () => this.cookies.get(this.refreshTokenName)

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
