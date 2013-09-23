define(function (require) {
  /*global mocha,chai */
  mocha.setup({
    ui: 'bdd'
  });

  (function (expect, assert) {
    var GLOBAL = window;

    GLOBAL.stop = function () {};
    GLOBAL.strictEqual = assert.strictEqual;
    GLOBAL.ok = assert.ok;
    GLOBAL.equal = assert.equal;
    GLOBAL.notEqual = assert.notEqual;
    GLOBAL.deepEqual = assert.deepEqual;
    GLOBAL.test = GLOBAL.it;
    GLOBAL.QUnit = {
      config: { current: { assertions: [] } }
    };
  })(chai.expect, chai.assert);
});
