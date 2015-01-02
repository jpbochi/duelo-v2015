define(function (require) {
  /*global mocha,chai */
  mocha.setup({
    ui: 'bdd'
  });

  chai.config.includeStack = true;
});
