define(function (require) {
  'use strict';
  var api = require('/tests/support/api.js');

  describe('GET /api', function () {
    it('lists root links', function (done) {
      api.get('/api').done(function (data) {
        assert.deepEqual(
          data._links,
          {
            'self': { href: '/api' },
            'games': { href: '/api/games', title: 'Create game' },
            'all-games': { href: '/api/games/all', title: 'All games' }
          }
        );
      }).always(done.bind(null, null));
    });
  });
});
