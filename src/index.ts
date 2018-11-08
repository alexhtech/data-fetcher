import Fetcher, { IConfig, IOptions, defaults, IArgs } from './Fetcher'

const { fetcher, config, stringifyQuery, parseQuery }: Fetcher = new Fetcher()

export { IArgs, IOptions, IConfig, defaults }
export { fetcher, config, stringifyQuery, parseQuery, fetcher as default, Fetcher }
