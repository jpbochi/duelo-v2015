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

  test('PUT rel=become-ready is 401 unathorized', function () {
    var context = this;
    api.put(context.gameHref + '/become-ready', null, 401).always(start);
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
    api.put(this.game._links.join, null, 403).always(start);
    ok(true);
  });

  test('link to become-ready becomes available', function () {
    var context = this;
    api.getGame(context).done(function (data) {
      deepEqual(data._links['become-ready'], { href: context.gameHref + '/become-ready' });
    }).always(start);
  });

  module('unjoined PUT rel=become-ready', {
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
    api.put(this.gameHref + '/become-ready', null, 403).always(start);
    ok(true);
  });

  module('PUT rel=become-ready', {
    setup: function () {
      var context = this;
      context.username = 'Robin';

      context.request = api.logIn(context).then(
        _.partial(api.createTestGame, context)
      ).then(function (data) {
        return api.put(context.game._links.join);
      }).then(function (data) {
        return api.put(context.game._links.self.href + '/become-ready');
      }).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('attempt to become-ready twice is 403 forbidden', function () {
    api.put(this.game._links.self.href + '/become-ready', null, 403).always(start);
    ok(true);
  });

  test('marks logged user as ready', function () {
    var context = this;
    api.getGame(context).done(function (data) {
      var loggedPlayer = _(data._embedded.player).find(function (player) {
        return player._links.self.href === data._links['viewed-by'].href;
      });

      deepEqual(
        _.pick(loggedPlayer, 'displayName', 'state'),
        { displayName: context.username, state: 'ready' },
        'data._embedded.player#[logged].state'
      );
    }).always(start);
  });

  module('last player to PUT rel=become-ready', {
    setup: function () {
      var context = this;
      context.username = 'Robin';

      context.request = api.logIn(context).then(
        _.partial(api.createTestGame, context)
      ).then(function (data) {
        return api.put(context.game._links.join);
      }).then(
        _.partial(api.testPlayersReady, context)
      ).then(function (data) {
        return api.put(context.game._links.self.href + '/become-ready');
      }).always(start);
    },
    teardown: api.logOutAndContinue
  });

  test('starts the game', function () {
    var context = this;
    api.getGame(context).done(function (data) {
      equal(data.state, 'playing', 'game.state');

      should.be(
        _(data._embedded.player).pluck('state'),
        function allBePlaying(states) {
          return states.all(function (state) { return state === 'playing'; });
        },
        'game._embedded.player#state'
      );
    }).always(start);
  });
});
