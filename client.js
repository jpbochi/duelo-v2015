define(function (require) {
  /*global hal */

  var client = require('./lib/client/api_client.js').extendHal();

  client.get('/api').then(function (root) {
    window.api = root;
  }).fail(function (jqXHR) {
    throw 'Failed to load api';
  });
});
