var monkeypatch = require('monkeypatch');

//NEVER CHANGE THE NAME OF THE VARIABLE __promiseDomainMonkeypatched

module.exports = {
  patch: function() {
    if (Promise && !Promise.__promiseDomainMonkeypatched) {
      Promise.__promiseDomainMonkeypatched = true;
      monkeypatch(Promise.prototype, 'then', function (original, fn1, fn2) {
        if (process.domain) {
          fn1 = fn1 && process.domain.bind(fn1);
          fn2 = fn2 && process.domain.bind(fn2);
        }
        return original(fn1, fn2);
      });

      monkeypatch(Promise.prototype, 'catch', function (original, fn1) {
        if (process.domain) {
          fn1 = fn1 && process.domain.bind(fn1);
        }
        return original(fn1);
      });
    }
  },
  unpatch: function() {
    if (Promise && Promise.__promiseDomainMonkeypatched) {
      Promise.__promiseDomainMonkeypatched = false;

      Promise.prototype.then.unpatch && Promise.prototype.then.unpatch();
      Promise.prototype.catch.unpatch && Promise.prototype.catch.unpatch();
    }
  }
};