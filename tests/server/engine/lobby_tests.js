define(function (require) {
  var _ = require('lodash');
  var assert = require('chai').assert;
  var sinon = require('sinon-restore');
  var should = require('tests/support/should.js');
  var mongo = require('lib/server/mongo.js');
  var lobby = require('lib/server/engine/lobby.js');

  var newGame = function (options) {
    return mongo.games.create({
      buildOptions: options
    });
  };
  var fakeUser = function (name, id) {
    return { displayName: name, _links: { self: { href: '#/player/' + id } } };
  };

  describe('lobby().join()', function () {
    it('adds player to game', function () {
      var game = newGame();
      lobby(game, fakeUser('le player')).join();

      assert.deepEqual(
        _.pluck(game.players, 'displayName'),
        ['le player']
      );
    });
  });
});
