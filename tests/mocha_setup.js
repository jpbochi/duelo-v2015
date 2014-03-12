define(function (require) {
  /*global mocha,chai */
  mocha.setup({
    ui: 'bdd'
  });

  chai.Assertion.includeStack = true;

  window.GLOBAL = window;
  window.assert = chai.assert;
});
