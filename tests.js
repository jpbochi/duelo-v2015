define(function (require) {
  var support = require('./tests/support');
  
  require('./tests/client');

  QUnit.start();
});
