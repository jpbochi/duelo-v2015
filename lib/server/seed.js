define(function () {
  'use strict';
  var mongo = require('lib/server/mongo.js');
  var _ = require('lodash');

  function handleErr(err, res) {
    if (err) {
      console.log(err, JSON.stringify(err));
      res.send(500, err);
    }
  }

  var seedPlayers = [
    { displayName: 'Alice', href: '/api/user/seed:alice' },
    { displayName: 'Bob', href: '/api/user/seed:bob' },
    { displayName: 'Charlie', href: '/api/user/seed:charlie' }
  ];

  var routes = {
    seed: function (req, res) {
      var gameCount = req.query.games;
      if (!gameCount) {
        return res.send(400, 'please, specify a query string param "games"');
      }

      var games = _.range(gameCount).map(function (gameIndex) {
        var players = seedPlayers.filter(function (player, playerIndex) {
          /*jshint bitwise:false*/
          return (gameIndex + 1) & (1 << playerIndex);
        });
        return mongo.games.build({ players: players }).toObject();
      });

      mongo.games.model.collection.insert(games, null, function (err, result) {
        if (err) { return handleErr(err, res); }

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
    app.post('/api/seed', routes.seed);
    app.delete('/api/delete-all', routes.deleteAll);
  }

  return { register: register };
});
