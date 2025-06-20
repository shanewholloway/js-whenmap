# WhenMap

`WhenMap` is an extension of `Map` that contains only promise instances,
inspired by [`customElements.whenDefined()`][CER].
WhenMap is particularly useful for decoupling uses of a value from code that
initalizes the value.

 [CER]: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined

## WhenMap API

```javascript
import { WhenMap } from 'whenmap'

let when_db = new WhenMap()

let p_ready = when_db.when('example_key')
p_ready.then(v => console.log('Ready!', {v}))

when_db.set('example_key', example_init())

async function example_init() {
  // async initialize process
  return {example: 42}
}
```

- `when_db.when(key)` returns a promise for the key. The promise
  may or may not be resolved.

- `when_db.get(key)` is an alias for `when_db.when(key)`

- `when_db.set(key, value)` resolves the promise for the specified key, returning `this`.

- `when_db.has(key)` returns
    `false` for untracked keys,
    `true` for resolved tracked keys, and
    `1` for unresolved tracked keys.

- `when_db.delete(key)` resolves a tracked key as `undefined` before removing it.

- `when_db.clear()` resolves any outstanding tracked keys as `undefined` before
  clearing all tracked keys.


## WhenAiter API

```javascript
import { WhenAiter } from 'whenmap'


// For streaming promises as they are settled
let misc_promises = [ 100, 20, 50 ].map(ms =>
  new Promise(done =>
    setTimeout(done, ms, `delay: ${ms}`) ))

for await (let each of WhenAiter.from(misc_promises)) {
  console.log('stream resolved:', detail)
}


// For streaming events
let when_stream = new WhenAiter(send => {
  document.body.addEventListener(
    'some_custom_event',
    evt => send(evt.detail),
    {signal: send.signal})
})

for await (let detail of when_stream) {
  console.log('use aiter event stream:', detail)
}
```

- `new WhenMap(init_arg, opt)` returns an async iterable.
    - If `init_arg` is iterable, `send()` is called on each item.
    - other `init_arg(send)` is invoked.

- `WhenMap.from(init_arg, opt)` is an alias for `new WhenMap`

- `aiter_pipe(opt, recv_self)` returns a connected `[send, recv]` pair
    - `send(value)` adds value to the internal queue, after awaiting it if a promisable.
        - `opt.on_error(err)` is an optional promise `.catch()` handler.
    - `send.stop()` terminates the async iterable stream from within the `init_arg` closure.
    - `send.ready` is a promise to provide overflow backpressure.
        - `opt.max_size` manages the `send.ready` promise

    - `recv` extends the `recv_self` prototype
    - `recv.size` returns the interal queue size
    - `recv` supports async iterable protocol: `for await (let each of when_stream) {}`
        - `recv.next()`
        - `recv.return()`
        - `recv.throw()`
        - `recv[Symbol.asyncIterator]()`

    - an AbortSignal instance is aborted when the stream is stopped.
        - assigned into `recv.signal` and `send.signal`


## Install

```bash
$ npm install whenmap
```

## License

[BSD 2-clause](LICENSE)

