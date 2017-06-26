# promise-domain-monkeypatch
Don't break domain usage in an es6 Promise chain

[This](https://github.com/nodejs/help/issues/555) issue sheds a bit more detail, but basically the ES6 promise implementation in Node doesn't carry through the domain context (if there is one).

This is a module to monkeypatch to fix this.

More are examples are in the tests.

## Useage

```javascript
require('promise-domain-monkeypatch');
```

This will apply the patch.

You can unpatch by doing the following:

```javascript
let PromisePatcher = require('promise-domain-monkeypatch');
PromisePatcher.unpatch();
```

### Not applying the patch immediately

```javascript
let PromisePatcher = require('promise-domain-monkeypatch/patcher');

...some code...

PromisePatcher.patch();

...some code...

PromisePatcher.unpatch();
```

## Tests

```bash
mocha --recursive  
```
