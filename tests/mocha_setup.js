define(function (require) {
  /*global mocha,chai */
  mocha.setup({
    ui: 'qunit'
  });

  (function (expect) {
    window.stop = function () {};

    window.equal = function (actual, expected, message) {
      return expect(actual).to.equal(expected, message);
    };
    window.deepEqual = function (actual, expected, message) {
      return expect(actual).to.eql(expected, message);
    };
  })(chai.expect);
});
