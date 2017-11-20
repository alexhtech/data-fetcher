import qs from 'qs'
import {
    getBaseUrl, isAuthenticated, getToken, getTokenPrefix
} from './utils/settings'
import {getRawData} from './utils/cookies'


class Fetcher {
    fetcher = (url, options = {}) => {
        const {
            params,
            queryParams,
            type = 'json',
            baseUrl = getBaseUrl(),
            method = 'get',
            customHeaders = false,
            query,
            body
        } = options

        const args = {
            mode: 'cors',
            credentials: 'same-origin',
            method: method.toUpperCase(),
            headers: new Headers()
        }

        let search = ''
        if (type === 'form-data') {
            args.body = body
            search = this.stringify(queryParams || query)
        } else if (type === 'json') {
            if (args.method === 'GET') {
                search = this.stringify(params || query)
                if (body) {
                    console.error('Warning: GET method doesn`t have a request body, you should use `query`')
                }
            } else {
                if (params || body) {
                    args.body = JSON.stringify(params || body)
                }
                if (queryParams || query) {
                    search = this.stringify(queryParams || query)
                }
            }

            args.headers.set('Accept', 'application/json')
            args.headers.set('Content-Type', 'application/json')
            args.headers.set('cookie', getRawData())
        } else {
            throw new Error(`Type '${type}' - is not supported in the Fetcher`)
        }


        if (isAuthenticated()) {
            args.headers.set('Authorization', `${getTokenPrefix()}${getToken()}`)
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
                            data.json().then(rej)
                        } else {
                            data.text().then(rej)
                        }
                    } else {
                        if (contentType && contentType.indexOf('application/json') !== -1) {
                            data.json().then(res)
                        } else {
                            data.text().then(res)
                        }
                    }
                })
                .catch(rej)
        })
    }

    stringify = params => qs.stringify(params, {addQueryPrefix: true}) || ''

    parse = queryString => qs.parse(queryString, {ignoreQueryPrefix: true})
}


export {
    Fetcher as default
}