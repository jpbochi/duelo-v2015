define(function () {
  'use strict';
  var mongo = require('lib/server/mongo.js');

  function handleErr(err, res) {
    if (err) {
      console.log(err, JSON.stringify(err));
      res.send(500, err);
    }
  }

  var routes = {
    seed: function (req, res) {
      var playerOne = { displayName: 'seed One', key: 'seed:one' };
      var playerTwo = { displayName: 'seed Two', key: 'seed:two' };

      var games = [
        mongo.games.build({ players: [playerOne, playerTwo] }).toObject(),
        mongo.games.build({ players: [playerTwo, playerOne] }).toObject()
      ];

      mongo.games.model.collection.insert(games, null, function (err, result) {
        if (err) { return handleErr(err, res); }

        res.send(200);
      });
    },
    deleteAll: function (req, res) {
      mongo.games.model.remove({}, true);

      res.send(202);
    }
  };

  function register(app) {
    app.post('/api/seed', routes.seed);
    app.delete('/api/delete-all', routes.deleteAll);
  }

  return { register: register };
});
