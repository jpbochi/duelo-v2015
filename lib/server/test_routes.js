define(function () {
  'use strict';
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var testPlayers = [
    { displayName: 'Alice', state: 'lobby', href: '/api-test/user/test:alice' },
    { displayName: 'Bob', state: 'lobby', href: '/api-test/user/test:bob' },
    { displayName: 'Charlie', state: 'lobby', href: '/api-test/user/test:charlie' }
  ];

  var routes = {
    seed: function (req, res) {
      var gameCount = req.query.games;
      if (!gameCount) {
        return res.send(400, 'please, specify a query string param "games"');
      }

      var games = _.range(gameCount).map(function (gameIndex) {
        var players = testPlayers.filter(function (player, playerIndex) {
          /*jshint bitwise:false*/
          return (gameIndex + 1) & (1 << playerIndex);
        });
        return mongo.games.create({ players: players }).toObject();
      });

      mongo.games.model.collection.insert(games, null, function (err, result) {
        if (err) { return common.handleErr(err, res); }

        res.status(200).send(result);
      });
    },
    testPlayersReady: function (req, res) {
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }

        game.players.forEach(function (player) {
          if ((/^\/api\-test\//).test(player.href)) {
            player.state = 'ready';
          }
        });
        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }
          res.send('ok');
        });
      });
    },
    deleteAll: function (req, res) {
      mongo.games.model.remove({}, function () {
        res.sendStatus(200);
      });
    }
  };

  function register(app) {
    app.post('/api-test/seed', routes.seed);
    app.put('/api-test/games/:id/test-players-ready', routes.testPlayersReady);
    app.delete('/api-test/delete-all', routes.deleteAll);
  }

  return { register: register };
});
