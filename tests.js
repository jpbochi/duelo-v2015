define(function (require) {
  var support = require('./tests/support');
  
  require('./tests/client');
  require('./tests/server');

  QUnit.start();
});
