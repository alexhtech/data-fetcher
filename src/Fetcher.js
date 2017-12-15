import qs from 'qs'
import * as defaults from './utils/settings'


class Fetcher {
    constructor(settings = defaults) {
        this.settings = settings
    }

    fetcher = (url, options = {}) => {
        const {
            params,
            queryParams,
            type = 'json',
            baseUrl = this.settings.getBaseUrl(),
            method = 'get',
            customHeaders = false,
            query,
            body,
            withData = false,
            ...rest
        } = options

        const args = {
            mode: 'cors',
            credentials: 'same-origin',
            method: method.toUpperCase(),
            headers: new Headers(),
            ...rest
        }

        let search = ''
        if (type === 'form-data') {
            args.body = body
            search = this.stringifyQuery(queryParams || query)
        } else if (type === 'json') {
            if (args.method === 'GET') {
                search = this.stringifyQuery(params || query)
                if (body) {
                    console.error('Warning: GET method doesn`t have a request body, you should use `query`')
                }
            } else {
                if (params || body) {
                    args.body = JSON.stringify(params || body)
                }
                if (queryParams || query) {
                    search = this.stringifyQuery(queryParams || query)
                }
            }

            args.headers.set('Accept', 'application/json')
            args.headers.set('Content-Type', 'application/json')
            args.headers.set('cookie', this.settings.cookies.getRawData())
        } else {
            throw new Error(`Type '${type}' - is not supported in the Fetcher`)
        }


        if (this.settings.isAuthenticated()) {
            args.headers.set('Authorization', `${this.settings.getTokenPrefix()}${this.settings.getToken()}`)
        }

        if (customHeaders) {
            args.headers = customHeaders
        }

        return new Promise((res, rej) => {
            fetch(baseUrl + url + search, args)
                .then(data => {
                    const contentType = data.headers.get('content-type')

                    if (data.status >= 400) {
                        if (contentType.indexOf('application/json') !== -1) {
                            data.json().then(response =>
                                rej({response, data})
                            )
                        } else {
                            data.text().then(response =>
                                rej({response, data})
                            )
                        }
                    } else {
                        if (contentType && contentType.indexOf('application/json') !== -1) {
                            data.json().then(response => res(
                                withData ? {
                                    response,
                                    data
                                } : response
                                )
                            )
                        } else {
                            data.text().then(response => res(
                                withData ? {
                                    response,
                                    data
                                } : response
                                )
                            )
                        }
                    }
                })
                .catch(e => {
                    if (typeof this.settings.onFail === 'function') {
                        return this.settings.onFail(e, {url, options})
                    }
                    return e
                })
        })
    }

    stringifyQuery = params => qs.stringify(params, {addQueryPrefix: true}) || ''

    parseQuery = queryString => qs.parse(queryString, {ignoreQueryPrefix: true})
}


export {
    Fetcher as default
}