define(function (require) {
  'use strict';
  var _ = require('/external/lodash/dist/lodash.js');
  var api = require('/tests/support/api.js');
  var should = require('/tests/support/should.js');

  describe('game', function () {
    beforeEach(api.logOutAndContinue);

    describe('logged POST /api/games', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'Batima';
        api.logIn(context)
        .then(api.createGame)
        .then(function (data, textStatus, jqXHR) {
          context.gameHref = jqXHR.getResponseHeader('Location');
        }).always(done.bind(null, null));
      });

      it('redirects to a created game', function (done) {
        var context = this;
        assert.notEqual(context.gameHref, null, 'Location != null');

        api.get(context.gameHref).done(function (data, textStatus, jqXHR) {
          assert.deepEqual(data._links.self, { href: context.gameHref });
        }).always(done.bind(null, null));
      });

      it('starts with logged user in embedded players', function (done) {
        var context = this;

        api.get(context.gameHref).done(function (data, textStatus, jqXHR) {
          should.be(data._embedded, should.bePlainObject, 'data._embedded');
          assert.isArray(data._embedded.player, 'data._embedded.player');

          assert.deepEqual(
            _.pluck(data._embedded.player, 'displayName'),
            [ context.username ],
            'data._embedded.player#displayName'
          );
        }).always(done.bind(null, null));
      });
    });

    describe('GET /api/game/:id', function () {
      beforeEach(function (done) {
        var context = this;
        context.request = api.createTestGame(context).always(done.bind(null, null));
      });

      it('has link to self', function () {
        assert.deepEqual(this.game._links.self, { href: this.gameHref });
      });

      it('content type is duelo-game', function () {
        this.request.done(function (data, textStatus, jqXHR) {
          var expectedType = 'duelo-game';
          var type = jqXHR.getResponseHeader('Content-Type');

          assert.equal(type, 'application/' + expectedType + '+hal+json', 'Content-Type');
          assert.equal(data._contentType, expectedType, 'data._contentType');
        });
      });

      it('does not expose any _id\'s', function () {
        assert.strictEqual(this.game._id, undefined, 'game._id');
        assert.strictEqual(this.game._embedded.player[0]._id, undefined, 'game._embedded.player[0]._id');
      });
    });

    describe('logged GET pre-existing /api/game/:id', function () {
      beforeEach(function (done) {
        var context = this;
        context.username = 'O Palhaco';

        api.createTestGame(context).then(
          _.partial(api.logIn, context)
        ).then(
          _.partial(api.getGame, context)
        ).then(done.bind(null, null));
      });

      it('has a link to the logged user', function () {
        assert.deepEqual(
          this.game._links['viewed-by'],
          this.user._links.self,
          'link[rel=viewed-by]'
        );
      });
    });
  });
});
