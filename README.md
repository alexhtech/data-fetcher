# data-fetcher
This is a simple and powerful promise based wrapper around native `fetch` or `node-fetch` for node.js

## Usage

### Simple GET request

```js
import {fetcher} from 'data-fetcher'


fetcher('https://api.github.com/users').then(users => {
  console.log(user)
})
```

### Custom method

```js
import {fetcher} from 'data-fetcher'


fetcher('http://example.com/users', {
  method: 'post', // any case
  body: {
    login: 'test',
    password: 'test'
  },
  query: {
    access_token: 'sometoken' // will stringify to search as string by `query-string` library
  }
}).then(user => {
  console.log(user)
})
```

### Defaults

```js
import {defaults} from 'data-fetcher'


console.log(defaults) 
//
{  
   baseUrl:'',
   args:{  
      mode:'cors',
      credentials:'same-origin',
      headers:{  
         Accept:'application/json',
         'Content-Type':'application/json'
      }
   }
}
```

You can customize any property of config, for example ...

`index.js` - endpoint of you app
```js
import {defaults} from 'data-fetcher'


defaults.baseUrl = 'http://example.com'
```

Then deep in the app

```js
import {fetcher, defaults} from 'data-fetcher'


fetcher('/login', {
  method: 'post',
  body: {
    login: 'test',
    password: 'test'
  }
}).then(user => {
  console.log(user)
})
```

### Custom headers

```js
fetcher('/users', {
  headers: {
    Authorization: `Bearer {jwtToken}`
  }
}).then(users => {
  console.log(users)
})
```

Or you can set it globaly. All that you need just modify your login method

Just for example

```js
import {fetcher, defaults} from 'data-fetcher'

const login = async body => {
  const {token} = fetcher('/login', {
    method: 'post',
    body
  })
  
  defaults.args.headers.Authorization = `Bearer ${token}`
}
```

**Then you can send anywhere request in your app securely :)**

> This way you can add any properties to the defaults.args that will be passed to fetch() as second argument or add it individually to fetcher() as second argument too

### onFail handler
if your token might be die after some time probably you will want to update it. It is do this way

`./src/storage.js`

```js
const {localStorage} = window

const setToken = token => {
    localStorage.setItem('token', token)
    defaults.args.headers.Authorization = token ? `Bearer ${token}` : undefined
}

const setRefreshToken = refreshToken => {
    localStorage.setItem('refreshToken', refreshToken)
}

const getToken = () =>
    localStorage.getItem('token')


const getRefreshToken = () =>
    localStorage.getItem('refreshToken')
    
export {
  setToken,
  setRefreshToken,
  getToken,
  getRefreshToken
}
```


`./src/index.js`

```js 
import {fetcher, defaults} from 'data-fetcher'
import {getToken, getRefreshToken, setToken, setRefreshToken} from './storage'


defaults.baseUrl = 'http://example.com'
defaults.onFail = async (e, params) => {
    const refreshToken = getRefreshToken()

    if (refreshToken && e.data.status === 401) { // only for 401 http status code but you can customize it for you
        const {token: newToken, refreshToken: newRefreshToken} = await fetcher('/login/refresh', {
            body: {
                refreshToken
            },
            method: 'post'
        }, false) // false, won't run error handler `onFail` if request is fail. // default false

        setToken(newToken)
        setRefreshToken(newRefreshToken)

        return fetcher(params.url, params.options, false)
    }

    throw e
}
```

> Then if one of your requests crashed with 401 status code and you have a refresh token will send request to update token and setup newToken and newRefreshToken and most important request which was crashed will resend again with new credentials. It will look like your request was sended without any troubles

### Package contents

```js
import fetcher, {fetcher, defaults, stringifyQuery, parseQuery, Fetcher} from 'data-fetcher'
```

As you have seen you can also just import default export from package.

**API**

`fetcher(url, options, catchError)`

**Parameters**

`url` - (string) an url to remote server
`options` - (object)

```
options = {
  baseUrl: string // default ''
  method: string // default 'get'
  body: object | string // default ''
  query: object | string // default ''
  withData: bool // default false
  type: string (json|formData) // default json
  headers: object | bool // default false
}
```

`catchError` - (bool) true - should catch errors and handle it only if onFail is specified it will be actual

`Fetcher` - class of fetcher to use in server-side application

`stringifyQuery` - will stringify an object to a string

`parseQuery` - will parse a string that was stringified to an object
