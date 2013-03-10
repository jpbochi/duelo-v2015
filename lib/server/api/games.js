define(function () {
  var mongo = require('lib/server/mongo.js');
  var hal = require('halberd');

  function handleErr(err, res) {
    if (err) {
      res.send(500, err);
    }
  }

  function buildPlayer(user) {
    return { displayName: user.displayName };
  }

  var routes = {
    create: function (req, res) {
      var players = [];
      req.user && players.push(buildPlayer(req.user));

      mongo.games.build({ players: players }).save(function (err, game) {
        if (err) { return handleErr(err, res); }

        res.set('Location', game.selfHref());
        res.send(201);
      });
    },
    get: function (req, res) {
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return handleErr(err, res); }

        var view = game.toPublicView();
        res.set('Content-Type', 'application/hal+json');
        res.json(view.toJSON());
      });
    },
    join: function (req, res) {
      //TODO if (!req.user) { fail(); }
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return handleErr(err, res); }

        game.players.push(buildPlayer(req.user));
        game.save(function (err, game) {
          if (err) { return handleErr(err, res); }

          res.send('ok');
        });
      });
    }
  };

  function register(app) {
    app.post('/api/games', routes.create);
    app.get('/api/games/:id', routes.get);
    app.post('/api/games/:id/join', routes.join);
  }

  return { register: register };
});
