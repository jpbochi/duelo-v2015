define(function (require) {
  require('/tests/client.js');
  require('/tests/api.js');

  $.get('/auth/logout').always(QUnit.start);
});
