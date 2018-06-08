import * as qs from 'qs'

export interface IArgs extends RequestInit {
    headers?: {
        [key: string]: string
    }
}

export interface IConfig {
    baseUrl?: string
    args: IArgs
    onFail?(error: any, data: { url: string; options: IOptions }): Promise<void>
}

export interface IOptions extends IArgs {
    baseUrl?: string
    type?: string
    query?: object
    body?: any
    withData?: boolean
}

export const defaults: IConfig = {
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

export default class Fetcher {
    constructor(public config: IConfig = defaults) {
        this.config = config
    }

    fetcher = async (url: string, options: IOptions = {}, catchError = true) => {
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

        const {
            args: { headers: baseHeaders, ...restArgs }
        } = this.config

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

                throw { error, data }
            } else {
                let response

                if (contentType && contentType.indexOf('application/json') !== -1) {
                    response = await data.json()
                } else {
                    response = await data.text()
                }

                return withData ? { response, data } : response
            }
        } catch (e) {
            const error = e.data ? e : { data: e }
            if (catchError && typeof this.config.onFail === 'function') {
                return this.config.onFail(error, { url, options })
            }
            throw error
        }
    }

    stringifyQuery = (params?: object) => {
        return qs.stringify(params, { addQueryPrefix: true }) || ''
    }

    parseQuery = (queryString: string) => {
        return qs.parse(queryString, { ignoreQueryPrefix: true })
    }
}
