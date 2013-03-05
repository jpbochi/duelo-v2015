define(function (require) {
  var support = require('/tests/support.js');

  require('/tests/client.js');
  require('/tests/api.js');

  QUnit.start();
});
