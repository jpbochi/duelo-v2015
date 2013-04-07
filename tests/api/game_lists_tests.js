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
      }).done(function (data, textStatus, jqXHR) {
        context.data = data;
        context.textStatus = textStatus;
        context.jqXHR = jqXHR;
      }).always(start);
    }
  });

  test('has a link to self', function () {
    deepEqual(this.data._links, { 'self': { href: '/api/games/all' } }, 'data._links');
  });

  test('content type is duelo-games-list', function () {
    var expectedType = 'duelo-games-list';
    var type = this.jqXHR.getResponseHeader('Content-Type');

    equal(type, 'application/' + expectedType + '+hal+json', 'Content-Type');
    equal(this.data._contentType, expectedType, 'data._contentType');
  });

  test('embedds all games', function () {
    should.be(this.data._embedded, should.bePlainObject, 'data._embedded');
    should.be(this.data._embedded.game, _.isArray, 'data._embedded.game');
    if (should.hasFailed()) { return; }

    should.be(
      _(this.data._embedded.game).pluck('_links').pluck('self').pluck('href'),
      function allMatchGameHref(links) {
        return links.all(function (href) {
          return (/^\/api\/games\/[0-9a-zA-Z]{24}$/).test(href);
        });
      },
      'data._embedded.game#_links#self#href'
    );
  });

  test('embedded games have state', function () {
    var games = this.data._embedded.game;
    if (!games) { return; }

    deepEqual(
      _.pluck(games, 'state'),
      ['lobby', 'lobby'],
      'data._embedded.game#state'
    );
  });

  test('embedded games have createAt', function () {
    var games = this.data._embedded.game;
    if (!games) { return; }

    should.be(
      _(games).pluck('createdAt'),
      function allAreDates(dates) {
        return dates.all(function (date) {
          return !isNaN(Date.parse(date));
        });
      },
      'data._embedded.game#createdAt'
    );
  });
});
