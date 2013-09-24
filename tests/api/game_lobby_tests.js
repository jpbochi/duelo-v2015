define(function (require) {
  'use strict';
  var _ = require('/external/lodash/dist/lodash.js');
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  describe('when on lobby', function () {
    beforeEach(api.logOutAndContinue);

    describe('unlogged', function () {
      beforeEach(function (done) {
        var context = this;

        api.createTestGame(context).always(done.bind(null, null));
      });

      it('PUT rel=join is 401 unathorized', function (done) {
        var context = this;
        api.put(context.gameHref + '/join', null, 401).always(done.bind(null, null));
      });

      it('PUT rel=become-ready is 401 unathorized', function (done) {
        var context = this;
        api.put(context.gameHref + '/become-ready', null, 401).always(done.bind(null, null));
      });
    });

    describe('logged GET game', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'Joker';

        context.request = api.logIn(context).then(
          _.partial(api.createTestGame, context)
        ).then(
          _.partial(api.getGame, context)
        ).always(done.bind(null, null));
      });

      it('has link to join game', function () {
        deepEqual(this.game._links.join, { href: this.gameHref + '/join' });
      });
    });

    describe('PUT rel=join', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'Joker';

        context.request = api.logIn(context).then(
          _.partial(api.createTestGame, context)
        ).then(function (data) {
          return api.put(context.game._links.join);
        }).always(done.bind(null, null));
      });

      it('adds logged user to game players list', function (done) {
        var context = this;
        var initialPlayers = _.pluck(context.game._embedded.player, 'displayName');
        var expectedPlayers = initialPlayers.concat(context.username);

        api.getGame(context).done(function (data) {
          deepEqual(
            _.pluck(data._embedded.player, 'displayName'),
            expectedPlayers,
            'data._embedded.player#displayName'
          );
        }).always(done.bind(null, null));
      });

      it('link to join twice is not present', function (done) {
        var context = this;
        api.getGame(context).then(function (data) {
          ok(!data._links.hasOwnProperty('join'), 'link[rel=join] should not be present');
        }).always(done.bind(null, null));
      });

      it('attempt to join twice is 403 forbidden', function (done) {
        api.put(this.game._links.join, null, 403).always(done.bind(null, null));
        ok(true);
      });

      it('link to become-ready becomes available', function (done) {
        var context = this;
        api.getGame(context).done(function (data) {
          deepEqual(data._links['become-ready'], { href: context.gameHref + '/become-ready' });
        }).always(done.bind(null, null));
      });
    });

    describe('unjoined PUT rel=become-ready', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'Coringa';

        context.request = api.logIn(context).then(
          _.partial(api.createTestGame, context)
        ).always(done.bind(null, null));
      });

      it('is 403 forbidden', function (done) {
        api.put(this.gameHref + '/become-ready', null, 403).always(done.bind(null, null));
        ok(true);
      });
    });

    describe('PUT rel=become-ready', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'Robin';

        context.request = api.logIn(context).then(
          _.partial(api.createTestGame, context)
        ).then(function (data) {
          return api.put(context.game._links.join);
        }).then(function (data) {
          return api.put(context.game._links.self.href + '/become-ready');
        }).always(done.bind(null, null));
      });

      it('attempt to become-ready twice is 403 forbidden', function (done) {
        api.put(this.game._links.self.href + '/become-ready', null, 403).always(done.bind(null, null));
        ok(true);
      });

      it('marks logged user as ready', function (done) {
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
        }).always(done.bind(null, null));
      });
    });

    describe('last player to PUT rel=become-ready', function (done) {
      beforeEach(function (done) {
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
        }).always(done.bind(null, null));
      });

      it('starts the game', function (done) {
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
        }).always(done.bind(null, null));
      });
    });
  });
});
