define(function (require) {
  'use strict';
  var _ = require('/external/lodash/lodash.js');
  var api = require('/tests/support/api.js');

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
      var type = jqXHR.getResponseHeader('Content-Type');

      equal(type, 'application/hal+json');
      deepEqual(data._links.self, { href: context.gameHref });
    }).always(start);
  });

  test('starts with logged user in the players list', function () {
    var context = this;

    api.get(context.gameHref).done(function (data, textStatus, jqXHR) {
      deepEqual(_.pluck(data.players, 'displayName'), [context.username]);
    }).always(start);
  });

  module('GET /api/game/:id', {
    setup: function () {
      var context = this;
      api.createTestGame(context).always(start);
    }
  });

  test('has link to self', function () {
    deepEqual(this.game._links.self, { href: this.gameHref });
  });

  test('has link to join game', function () {
    deepEqual(this.game._links.join, { href: this.gameHref + '/join' });
  });

  test('does not expose any _id\'s', function () {
    strictEqual(this.game._id, undefined, 'game._id');
    strictEqual(this.game.players[0]._id, undefined, 'game.players[0]._id');
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
    var initialPlayers = _.pluck(context.game.players, 'displayName');
    var expectedPlayers = initialPlayers.concat(context.username);

    api.get(context.gameHref).done(function (data) {
      deepEqual(_.pluck(data.players, 'displayName'), expectedPlayers);
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
