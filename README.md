# WhenMap

`WhenMap` is an extension of `Map` that contains only promise instances,
inspired by [`customElements.whenDefined()`][CER].
WhenMap is particularly useful for decoupling uses of a value from code that
initalizes the value.

 [CER]: https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined

## Use

```javascript
import { WhenMap } from 'whenmap'

let whenmap = new WhenMap()

let p_ready = whenmap.when('example_key')
p_ready.then(v => console.log('Ready!', {v}))

whenmap.set('example_key', example_init())

async function example_init() {
  // async initialize process
  return {example: 42}
}
```

## WhenMap API
- `whenmap.when(key)` returns a promise for the key. The promise
  may or may not be resolved.

- `whenmap.get(key)` is an alias for `whenmap.when(key)`

- `whenmap.set(key, value)` resolves the promise for the specified key, returning `this`.

- `whenmap.has(key)` returns
    `false` for untracked keys,
    `true` for resolved tracked keys, and
    `1` for unresolved tracked keys.

- `whenmap.delete(key)` resolves a tracked key as `undefined` before removing it.

- `whenmap.clear()` resolves any outstanding tracked keys as `undefined` before
  clearing all tracked keys.

## Install

```bash
$ npm install whenmap
```

## License

[BSD 2-clause](LICENSE)

