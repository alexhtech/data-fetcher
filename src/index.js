import Fetcher from './Fetcher'


const defaults = Fetcher.defaults

const {
    fetcher,
    stringifyQuery,
    parseQuery
} = new Fetcher()

export {
    fetcher as default,
    stringifyQuery,
    parseQuery,
    defaults,
    Fetcher
}