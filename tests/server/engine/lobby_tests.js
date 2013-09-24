define(function (require) {
  var _ = require('lodash');
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

  QUnit.module('lobby().join()');

  it('adds player to game', function () {
    var game = newGame();

    lobby(game, fakeUser('le player')).join();

    deepEqual(_.pluck(game.players, 'displayName'), [ 'le player' ]);
  });
});
