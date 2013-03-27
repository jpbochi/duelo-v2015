define(function (require) {
  'use strict';
  var api = require('/tests/support/api.js');

  module('GET /api/games/all');

  test('lists all games', function () {
    api.get('/api/games/all').done(function (data) {
      deepEqual(data._links, { 'self': { href: '/api/games/all' } });

      //TODO: verify array of embedded games
    }).always(start);
  });
});
