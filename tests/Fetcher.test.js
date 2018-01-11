import Fetcher from '../src/Fetcher'
import fetch from 'node-fetch'


global.fetch = fetch

test('fetch github user', async () => {
    const {fetcher} = new Fetcher()
    const login = 'alexolefirenko'
    const response = await fetcher(`https://api.github.com/users/${login}`)
    expect(response.login).toBe(login)
})

test('throws a not found error', async () => {
    const {fetcher} = new Fetcher()

    try {
        await fetcher('http://addresswhichcannotbefound.com')
    } catch (e) {
        expect(e.data.code).toBe('ENOTFOUND')
    }
})