define(function (require) {
  var lo = require('lodash');
  var sinon = require('sinon-restore');
  var support = require('tests/support/server.js');
  var mongo = require('lib/server/mongo.js');
  var games = mongo.games;

  function verifyGameIsValid(game) {
    stop();
    game.validate(function (err) {
      start();
      equal(err, null, 'game should be valid');
    });
  }

  QUnit.module('mongo.games.create');

  test('builds a valid game in lobby state by default', function () {
    var game = games.build();

    equal(game.state, 'lobby', 'game.status');
    verifyGameIsValid(game);
  });

  test('accepts an initial player', function () {
    var player = { name: 'O Joker' };
    var game = games.build({ players: [player] });

    deepEqual(lo.pluck(game.players, 'name'), ['O Joker']);
    verifyGameIsValid(game);
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
