define(function (require) {
  /*global _*/
  'use strict';
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  module('GET /api/games/all', {
    setup: function () {
      var context = this;

      context.request = api.delete('/api/delete-all').then(function () {
        return api.post('/api/seed');
      }).then(function () {
        return api.get('/api/games/all');
      }).always(start);
    }
  });

  test('has a link to self', function () {
    this.request.done(function (data, textStatus, jqXHR) {
      deepEqual(data._links, { 'self': { href: '/api/games/all' } }, 'data._links');
    });
  });

  test('embedds all games', function () {
    this.request.done(function (data, textStatus, jqXHR) {
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
    });
  });

  test('content type is duelo-games-list', function () {
    this.request.done(function (data, textStatus, jqXHR) {
      var type = jqXHR.getResponseHeader('Content-Type');
      equal(type, 'application/duelo-games-list+hal+json');
    });
  });
});
