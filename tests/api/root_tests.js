define(function (require) {
  'use strict';
  var api = require('/tests/support/api.js');

  module('GET /api');

  test('lists root links', function () {
    api.get('/api').done(function (data) {
      deepEqual(data._links, {
        'self': { href: '/api' },
        'games': { href: '/api/games', title: 'Create game' },
        'all-games': { href: '/api/games/all', title: 'All games' }
      });
    }).always(start);
  });
});
