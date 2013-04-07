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

  module('logged POST /api/game/:id/join', {
    setup: function () {
      var context = this;
      context.username = 'Joker';

      context.request = api.createTestGame(context).then(
        _.partial(api.logIn, context)
      ).then(function (data) {
        return api.post(context.game._links.join);
      }).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('adds logged user to game players list', function () {
    var context = this;
    var initialPlayers = _.pluck(context.game._embedded.player, 'displayName');
    var expectedPlayers = initialPlayers.concat(context.username);

    api.get(context.gameHref).done(function (data) {
      deepEqual(
        _.pluck(data._embedded.player, 'displayName'),
        expectedPlayers,
        'data._embedded.player#displayName'
      );
    }).always(start);
  });

  test('link to join twice is not present', function () {
    var context = this;
    api.get(context.gameHref).then(function (data) {
      equal(data._links.join, null, 'link[rel=join] should not be present');
    }).always(start);
  });

  test('attempt to join twice is 403 forbidden', function () {
    var context = this;
    api.post(context.game._links.join, null, 403).always(start);
    ok(true);
  });

  module('unlogged POST /api/game/:id/join', {
    setup: function () {
      var context = this;

      api.createTestGame(context).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('is 401 unathorized', function () {
    var context = this;
    api.post(context.game._links.join, null, 401).always(start);
    ok(true);
  });
});
