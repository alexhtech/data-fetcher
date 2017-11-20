import isBrowser from 'is-browser'


class Cookies {
    constructor() {
        this.cookies = {}
    }

    plugToRequest = (req, res) => {
        this.cookiesRaw = req.headers.cookie
        this.res = res
        this.parse()
    }

    getRawData = () => isBrowser ? window.document.cookie : this.cookiesRaw

    parse = (raw = this.getRawData()) => {
        raw.split(';').forEach(item => {
            const i = item.indexOf('=')
            this.cookies[item.slice(0, i)] = item.slice(i + 1)
        })
        return this.cookies
    }

    get = key => isBrowser ? this.parse()[key] : this.cookies[key]


    stringifyOptions = (options = {}) =>
        Object.keys(options).map(item => `${item}=${options[item]}`).join(';')

    stringify = (key, value, options) =>
        `${key}=${value};${this.stringifyOptions(options)}`

    set = (key, value, {maxAge, ...rest} = {}) => {
        const opt = {
            maxAge: maxAge * 1000,
            ...rest
        }

        if (isBrowser) {
            window.document.cookie = this.stringify(key, value, opt)
        } else {
            this.res.cookie(key, value, opt)
            this.cookies[key] = value
        }
    }

    remove = (key, options) => {
        const opt = {
            expires: new Date(1970, 1, 1, 0, 0, 1),
            maxAge: 0,
            ...options
        }

        if (isBrowser) {
            this.set(key, '', opt)
        } else {
            this.res.clearCookie(key, opt)
            delete this.cookies[key]
        }
    }
}


export {
    Cookies as default
}