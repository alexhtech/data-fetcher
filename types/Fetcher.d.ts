export interface IArgs extends RequestInit {
    headers?: {
        [key: string]: string;
    };
}
export interface IConfig {
    baseUrl?: string;
    args: IArgs;
    onFail?(error: any, data: {
        url: string;
        options: IOptions;
    }): Promise<void>;
}
export interface IOptions extends IArgs {
    baseUrl?: string;
    type?: string;
    query?: object;
    body?: any;
    withData?: boolean;
}
export declare const defaults: IConfig;
export default class Fetcher {
    config: IConfig;
    constructor(config?: IConfig);
    fetcher: (url: string, options?: IOptions, catchError?: boolean) => Promise<any>;
    stringifyQuery: (params?: object | undefined) => string;
    parseQuery: (queryString: string) => any;
}
