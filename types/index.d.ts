import { IFetcher, IConfig, IOptions, defaults, IArgs } from "./Fetcher";
declare const fetcher: (url: string, options?: IOptions, catchError?: boolean) => Promise<any>, config: IConfig, stringifyQuery: (params?: object | undefined) => string, parseQuery: (queryString: string) => any;
export { IFetcher, IArgs, IOptions, IConfig, defaults };
export { fetcher, config, stringifyQuery, parseQuery, fetcher as default };
