define(function (require) {
  var _ = require('lodash');
  var sinon = require('sinon-restore');
  var should = require('tests/support/should.js');
  var mongo = require('lib/server/mongo.js');

  var newGame = function (options) {
    return mongo.games.create({
      buildOptions: options
    });
  };

  QUnit.module('builder.build() with default options');

  test('builds a board with 3x2 tiles', function () {
    var game = newGame({ dimensions: [3, 2] });

    game.builder().build();

    notEqual(game.board, null, 'game.board should not be null');
    if (should.hasFailed()) { return; }

    deepEqual(game.board.tiles, [['a1', 'a2'], ['b1', 'b2'], ['c1', 'c2']], 'game.board');
  });
});
