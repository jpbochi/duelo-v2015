define(function (require) {
  /*global _*/
  'use strict';
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  module('GET /api/games/all', {
    setup: function () {
      api.delete('/api/delete-all').always(start);
    }
  });

  test('lists all games', function () {
    api.post('/api/seed').then(function () {
      api.get('/api/games/all').done(function (data) {
        deepEqual(data._links, { 'self': { href: '/api/games/all' } }, 'data._links');

        should.be(data._embedded, should.bePlainObject, 'data._embedded');
        should.be(data._embedded.game, _.isArray, 'data._embedded.game');

        should.be(
          _(data._embedded.game).pluck('_links').pluck('self').pluck('href'),
          function allMatchGameHref(links) {
            return links.all(function (href) {
              return (/^\/api\/games\/[0-9a-zA-Z]{24}$/).test(href);
            });
          },
          'data._embedded.game#_links#self#href'
        );
        deepEqual(
          _.pluck(data._embedded.game, 'state'),
          _.map(data._embedded.game, function () { return 'lobby'; }),
          'data._embedded.game#state'
        );
      }).always(start);
    });
  });
});
