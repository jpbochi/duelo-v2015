define(function () {
  var mongo = require('lib/server/mongo.js');
  var hal = require('halberd');
  var _ = require('lodash');

  function handleErr(err, res) {
    if (err) {
      res.send(500, err);
    }
  }

  function buildPlayer(user) {
    return {
      displayName: user.displayName,
      key: user.key
    };
  }

  function canJoin(game, user) {
    return !_(game.players).pluck('key').contains(user.key);
  }

  function addLinks(game, view, user) {
    view.link('join', view._links.self.href + '/join');
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
        addLinks(game, view, req.user);

        res.set('Content-Type', 'application/hal+json');
        res.json(view.toJSON());
      });
    },
    join: function (req, res) {
      if (!req.user) { return res.send(401, 'Please log in to join a game'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return handleErr(err, res); }

        if (!canJoin(game, req.user)) {
          return res.send(403, 'Not allowed to log twice');
        }

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
