define(function (require) {
  var _ = require('lodash');
  var sinon = require('sinon-restore');
  var mongo = require('../../lib/server/mongo.js');
  var games = mongo.games;

  QUnit.module('mongo.games.create');

  test('creates a game in lobby', function () {
    stop();

    games.create(function (err, game) {
      strictEqual(err, null);

      equal(game.status, 'lobby', 'game.status');

      games.model.findOne({}, function (err, result) {
        start();
        strictEqual(err, null);

        deepEqual(result.id, game.id);
      });
    });
  });
});
