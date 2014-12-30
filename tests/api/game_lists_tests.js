define(function (require) {
  'use strict';
  /*global _*/
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  describe('GET /api/games/all', function () {
    beforeEach(function (done) {
      var context = this;

      context.request = api.del('/api-test/delete-all').then(function () {
        return api.post('/api-test/seed?games=3');
      }).then(function () {
        return api.get('/api/games/all');
      }).done(function (data, textStatus, jqXHR) {
        context.data = data;
        context.textStatus = textStatus;
        context.jqXHR = jqXHR;
      }).always(done.bind(null, null));
    });

    it('has a link to self', function () {
      assert.deepEqual(this.data._links, { 'self': { href: '/api/games/all' } }, 'data._links');
    });

    it('content type is duelo-games-list', function () {
      var expectedType = 'duelo-games-list';
      var type = this.jqXHR.getResponseHeader('Content-Type');

      assert.equal(type, 'application/' + expectedType + '+json; charset=utf-8', 'Content-Type');
      assert.equal(this.data._contentType, expectedType, 'data._contentType');
    });

    it('embedds all games', function () {
      should.be(this.data._embedded, should.bePlainObject, 'data._embedded');
      assert.isArray(this.data._embedded.game, 'data._embedded.game');

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

    it('embedded games have state', function () {
      var games = this.data._embedded.game;
      if (!games) { return; }

      assert.deepEqual(
        _.pluck(games, 'state'),
        ['lobby', 'lobby', 'lobby'],
        'data._embedded.game#state'
      );
    });

    it('embedded games have createAt', function () {
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

    it('embedded games have embedded players', function () {
      var games = this.data._embedded.game;
      if (!games) { return; }

      should.be(
        _(games).pluck('_embedded'),
        function allBePlainObjects(embedded) {
          return embedded.all(_.isPlainObject);
        },
        'data._embedded.game#embedded'
      );
      should.be(
        _(games).pluck('_embedded').pluck('player'),
        function allArePlayers(players) {
          return players.flatten().all(function (player) {
            return player &&
            player._links &&
            player._links.self &&
            (/^\/api(\-test)?\/user\//).test(player._links.self.href);
          });
        },
        'data._embedded.game#embedded.player'
      );
    });
  });
});
