var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as qs from 'qs';
export const defaults = {
    baseUrl: '',
    args: {
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }
};
export default class Fetcher {
    constructor(config = defaults) {
        this.config = config;
        this.fetcher = (url, options = {}, catchError = true) => __awaiter(this, void 0, void 0, function* () {
            const { type = 'json', baseUrl = this.config.baseUrl, method = 'get', headers = {}, query, body, withData = false } = options, rest = __rest(options, ["type", "baseUrl", "method", "headers", "query", "body", "withData"]);
            const _a = this.config.args, { headers: baseHeaders } = _a, restArgs = __rest(_a, ["headers"]);
            const args = Object.assign({}, restArgs, { method: method.toUpperCase() }, rest, { headers: Object.assign({}, baseHeaders, headers) });
            let search = '';
            if (type === 'form-data') {
                args.body = body;
                search = this.stringifyQuery(query);
                delete args.headers['Content-Type'];
            }
            else if (type === 'json') {
                if (args.method === 'GET') {
                    search = this.stringifyQuery(query);
                    if (body) {
                        console.error('Warning: GET method doesn`t have a request body, you should use `query`');
                    }
                }
                else {
                    if (body) {
                        args.body = typeof body === 'string' ? body : JSON.stringify(body);
                    }
                    if (query) {
                        search = this.stringifyQuery(query);
                    }
                }
            }
            else {
                throw new Error(`Type '${type}' - is not supported in the Fetcher`);
            }
            try {
                const data = yield fetch(baseUrl + url + search, args);
                const contentType = data.headers.get('content-type');
                if (data.status >= 400) {
                    let error;
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        error = yield data.json();
                    }
                    else {
                        error = yield data.text();
                    }
                    throw { error, data };
                }
                else {
                    let response;
                    if (contentType && contentType.indexOf('application/json') !== -1) {
                        response = yield data.json();
                    }
                    else {
                        response = yield data.text();
                    }
                    return withData ? { response, data } : response;
                }
            }
            catch (e) {
                const error = e.data ? e : { data: e };
                if (catchError && typeof this.config.onFail === 'function') {
                    return this.config.onFail(error, { url, options });
                }
                throw error;
            }
        });
        this.stringifyQuery = (params) => {
            return qs.stringify(params, { addQueryPrefix: true }) || '';
        };
        this.parseQuery = (queryString) => {
            return qs.parse(queryString, { ignoreQueryPrefix: true });
        };
        this.config = config;
    }
}
