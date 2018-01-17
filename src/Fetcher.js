import qs from 'qs'


class Fetcher {
    constructor(config = Fetcher.defaults) {
        this.config = config
    }

    static defaults = {
        baseUrl: '',
        args: {
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }
    }

    fetcher = async (url, options = {}, catchError = true) => {
        const {
            type = 'json',
            baseUrl = this.config.baseUrl,
            method = 'get',
            headers = {},
            query,
            body,
            withData = false,
            ...rest
        } = options

        const {args: {headers: baseHeaders, ...restArgs}} = this.config

        const args = {
            ...restArgs,
            method: method.toUpperCase(),
            ...rest,
            headers: {
                ...baseHeaders,
                ...headers
            }
        }


        let search = ''


        if (type === 'form-data') {
            args.body = body
            search = this.stringifyQuery(query)
            delete args.headers['Content-Type']
        } else if (type === 'json') {
            if (args.method === 'GET') {
                search = this.stringifyQuery(query)
                if (body) {
                    console.error('Warning: GET method doesn`t have a request body, you should use `query`')
                }
            } else {
                if (body) {
                    args.body = typeof body === 'string' ? body : JSON.stringify(body)
                }
                if (query) {
                    search = this.stringifyQuery(query)
                }
            }
        } else {
            throw new Error(`Type '${type}' - is not supported in the Fetcher`)
        }

        try {
            const data = await fetch(baseUrl + url + search, args)
            const contentType = data.headers.get('content-type')

            if (data.status >= 400) {
                let error

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    error = await data.json()
                } else {
                    error = await data.text()
                }

                throw {error, data}
            } else {
                let response

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    response = await data.json()
                } else {
                    response = await data.text()
                }

                return withData ? {response, data} : response
            }
        } catch (e) {
            const error = e.data ? e : {data: e}
            if (catchError && typeof this.config.onFail === 'function') {
                return this.config.onFail(error, {url, options})
            } else {
                throw error
            }
        }
    }


    stringifyQuery = params => qs.stringify(params, {addQueryPrefix: true}) || ''

    parseQuery = queryString => qs.parse(queryString, {ignoreQueryPrefix: true})
}


export {
    Fetcher as default
}