define(function (require) {
  /*global mocha,chai */
  mocha.setup({
    ui: 'bdd'
  });

  chai.Assertion.includeStack = true;

  (function (expect, assert) {
    var GLOBAL = window;

    GLOBAL.GLOBAL = window;
    GLOBAL.assert = assert;
    GLOBAL.strictEqual = assert.strictEqual;
    GLOBAL.ok = assert.ok;
    GLOBAL.equal = assert.equal;
    GLOBAL.notEqual = assert.notEqual;
    GLOBAL.deepEqual = assert.deepEqual;
    GLOBAL.test = GLOBAL.it;
  })(chai.expect, chai.assert);
});
