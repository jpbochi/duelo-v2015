define(function () {
  var mongo = require('lib/server/mongo.js');
  var hal = require('halberd');

  function handleErr(err, res) {
    if (err) {
      res.send(500, err);
    }
  }

  var routes = {
    postGame: function (req, res) {
      var player = {
        name: req.user.displayName
      };
      mongo.games.build({ players: [player] }).save(function (err, game) {
        if (err) { return handleErr(err, res); }

        res.set('Location', game.selfHref());
        res.send(201);
      });
    },
    getGame: function (req, res) {
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return handleErr(err, res); }

        var view = game.toPublicView();
        res.set('Content-Type', 'application/hal+json');
        res.json(view.toJSON());
      });
    }
  };

  function register(app) {
    app.post('/api/games', routes.postGame);
    app.get('/api/games/:id', routes.getGame);
  }

  return { register: register };
});
