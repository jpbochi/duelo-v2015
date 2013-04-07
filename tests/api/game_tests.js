define(function (require) {
  'use strict';
  var _ = require('/external/lodash/lodash.js');
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  module('logged POST /api/games', {
    setup: function () {
      var context = this;
      context.username = 'Batima';
      api.logIn(context)
      .then(api.createGame)
      .then(function (data, textStatus, jqXHR) {
        context.gameHref = jqXHR.getResponseHeader('Location');
      }).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('redirects to a created game', function () {
    var context = this;
    notEqual(context.gameHref, null, 'Location != null');

    api.get(context.gameHref).done(function (data, textStatus, jqXHR) {
      deepEqual(data._links.self, { href: context.gameHref });
    }).always(start);
  });

  test('starts with logged user in embedded players', function () {
    var context = this;

    api.get(context.gameHref).done(function (data, textStatus, jqXHR) {
      should.be(data._embedded, should.bePlainObject, 'data._embedded');
      if (should.hasFailed()) { return; }
      should.be(data._embedded.player, Array.isArray, 'data._embedded.player');
      if (should.hasFailed()) { return; }

      deepEqual(
        _.pluck(data._embedded.player, 'displayName'),
        [ context.username ],
        'data._embedded.player#displayName'
      );
    }).always(start);
  });

  module('GET /api/game/:id', {
    setup: function () {
      var context = this;
      context.request = api.createTestGame(context).always(start);
    }
  });

  test('has link to self', function () {
    deepEqual(this.game._links.self, { href: this.gameHref });
  });

  test('content type is duelo-game', function () {
    this.request.done(function (data, textStatus, jqXHR) {
      var expectedType = 'duelo-game';
      var type = jqXHR.getResponseHeader('Content-Type');

      equal(type, 'application/' + expectedType + '+hal+json', 'Content-Type');
      equal(data._contentType, expectedType, 'data._contentType');
    });
  });

  test('has link to join game', function () {
    deepEqual(this.game._links.join, { href: this.gameHref + '/join' });
  });

  test('does not expose any _id\'s', function () {
    strictEqual(this.game._id, undefined, 'game._id');
    strictEqual(this.game._embedded.player[0]._id, undefined, 'game._embedded.player[0]._id');
  });

  module('logged GET /api/game/:id', {
    setup: function () {
      var context = this;
      context.username = 'O Palhaco';

      api.createTestGame(context).then(
        _.partial(api.logIn, context)
      ).then(
        _.partial(api.getGame, context)
      ).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('has a link to the logged user', function () {
    deepEqual(this.game._links['viewed-by'], this.user._links.self, 'link[rel=viewed-by]');
  });
});
