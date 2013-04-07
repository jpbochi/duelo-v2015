define(function () {
  'use strict';
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var testPlayers = [
    { displayName: 'Alice', state: 'lobby', href: '/api/user/test:alice' },
    { displayName: 'Bob', state: 'lobby', href: '/api/user/test:bob' },
    { displayName: 'Charlie', state: 'lobby', href: '/api/user/test:charlie' }
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
        return mongo.games.build({ players: players }).toObject();
      });

      mongo.games.model.collection.insert(games, null, function (err, result) {
        if (err) { return common.handleErr(err, res); }

        res.send(200, result);
      });
    },
    deleteAll: function (req, res) {
      mongo.games.model.remove({}, function () {
        res.send(200);
      });
    }
  };

  function register(app) {
    app.post('/api-test/seed', routes.seed);
    app.delete('/api-test/delete-all', routes.deleteAll);
  }

  return { register: register };
});
