define(function (require) {
  var _ = require('lodash');
  var sinon = require('sinon-restore');
  var support = require('tests/support/server.js');
  var mongo = require('lib/server/mongo.js');
  var games = mongo.games;

  QUnit.module('mongo.games.create');

  test('creates a game in lobby state', function () {
    stop();

    games.create(function (err, game) {
      strictEqual(err, null);

      equal(game.state, 'lobby', 'game.status');

      games.model.findOne({}, function (err, result) {
        start();
        strictEqual(err, null);

        equal(result.id, game.id);
      });
    });
  });

  QUnit.module('mongo.games.get');

  test('gets a game by its id', function () {
    stop();

    var existing = [
      new games.model({ state: 'one' }),
      new games.model({ state: 'two' })
    ];

    support.saveAll(existing, function (all) {
      games.get(existing[1].id, function (err, result) {
        start();
        strictEqual(err, null);

        equal(result.id, existing[1].id);
        equal(result.state, 'two');
      });
    });
  });
});
