define(function () {
  var mongo = require('lib/server/mongo.js');
  var hal = require('hal');

  function handleErr(err, res) {
    if (err) {
      res.send(500, err);
    }
  }

  var routes = {
    postGame: function (req, res) {
      mongo.games.create(function (err, game) {
        if (err) { return handleErr(err, res); }

        res.set('Location', game.selfHref());
        res.send(201);
      });
    },
    getGame: function (req, res) {
      res.set('Content-Type', 'application/hal+json');
      res.json({});
    }
  };

  function register(app) {
    app.post('/api/games', routes.postGame);
    app.get('/api/games/:id', routes.getGame);
  }

  return { register: register };
});
