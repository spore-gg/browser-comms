# client-rpc

### An iframe rpc library

## Install

```bash
$ npm install spore-gg/browser-comms
```

## API

```javascript
import BrowserComms from 'browser-comms'

const browserComms = new BrowserComms({
  isParentValidFn: (origin) => origin === 'http://x.com'
})

browserComms.listen()

browserComms.on('methodName', (message) => `${message} ok`

const result = browserComms.call('methodName', 'hello')
console.log(result) // 'hello ok'
```

```javascript
// @param {Object} config
// @param {Number} [config.timeout=3000] - request timeout (ms)
// @param {Function<Boolean>} config.isParentValidFn - restrict parent origin
constructor: ({ timeout, isParentValidFn } = {}) => null

// Binds global message listener
// Must be called before .call()
listen: =>

// @param {String} method
// @param {...*} params
// @returns Promise
call: (method, params...) =>

// Register method to be called on child request, or local request fallback
// @param {String} method
// @param {Function} fn
on: (method, fn) =>
```
