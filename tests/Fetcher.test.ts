import Fetcher from '../src/Fetcher'
import fetch from 'node-fetch'

global.fetch = fetch

const { fetcher, parseQuery, stringifyQuery } = new Fetcher()

test('fetch github user', async () => {
    const login = 'alexolefirenko'
    const response = await fetcher(`https://api.github.com/users/${login}`)
    expect(response.login).toBe(login)
})

test('throws a not found error', async () => {
    const { fetcher } = new Fetcher()

    try {
        await fetcher('http://addresswhichcannotbefound.com')
    } catch (e) {
        expect(e.data.code).toBe('ENOTFOUND')
    }
})

test('query stringifier', () => {
    const input = {
        someKey: 'someValue'
    }
    const output = '?someKey=someValue'
    expect(stringifyQuery(input)).toBe(output)
})

test('query parser', () => {
    const input = '?someKey=someValue'
    const output = {
        someKey: 'someValue'
    }

    expect(parseQuery(input)).toEqual(output)
})
