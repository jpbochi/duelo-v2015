define(function (require) {
  'use strict';
  var _ = require('/external/lodash/lodash.js');
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  module('unlogged, on a lobby game', {
    setup: function () {
      var context = this;

      api.createTestGame(context).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('PUT rel=join is 401 unathorized', function () {
    var context = this;
    api.put(context.gameHref + '/join', null, 401).always(start);
    ok(true);
  });

  test('PUT rel=get-ready is 401 unathorized', function () {
    var context = this;
    api.put(context.gameHref + '/get-ready', null, 401).always(start);
    ok(true);
  });

  module('logged GET game', {
    setup: function () {
      var context = this;
      context.username = 'Joker';

      context.request = api.logIn(context).then(
        _.partial(api.createTestGame, context)
      ).then(
        _.partial(api.getGame, context)
      ).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('has link to join game', function () {
    deepEqual(this.game._links.join, { href: this.gameHref + '/join' });
  });

  module('PUT rel=join', {
    setup: function () {
      var context = this;
      context.username = 'Joker';

      context.request = api.logIn(context).then(
        _.partial(api.createTestGame, context)
      ).then(function (data) {
        return api.put(context.game._links.join);
      }).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('adds logged user to game players list', function () {
    var context = this;
    var initialPlayers = _.pluck(context.game._embedded.player, 'displayName');
    var expectedPlayers = initialPlayers.concat(context.username);

    api.getGame(context).done(function (data) {
      deepEqual(
        _.pluck(data._embedded.player, 'displayName'),
        expectedPlayers,
        'data._embedded.player#displayName'
      );
    }).always(start);
  });

  test('link to join twice is not present', function () {
    var context = this;
    api.getGame(context).then(function (data) {
      ok(!data._links.hasOwnProperty('join'), 'link[rel=join] should not be present');
    }).always(start);
  });

  test('attempt to join twice is 403 forbidden', function () {
    var context = this;
    api.put(context.game._links.join, null, 403).always(start);
    ok(true);
  });

  test('link to get-ready becomes available', function () {
    var context = this;
    api.getGame(context).done(function (data) {
      deepEqual(data._links['get-ready'], { href: context.gameHref + '/get-ready' });
    }).always(start);
  });

  module('unjoined PUT rel=get-ready', {
    setup: function () {
      var context = this;
      context.username = 'Coringa';

      context.request = api.logIn(context).then(
        _.partial(api.createTestGame, context)
      ).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('is 403 forbidden', function () {
    api.put(this.gameHref + '/get-ready', null, 403).always(start);
    ok(true);
  });
});
