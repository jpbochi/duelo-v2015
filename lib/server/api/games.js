define(function () {
  'use strict';
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
      href: user._links.self.href
    };
  }

  function canJoin(game, user) {
    return user && !_(game.players).pluck('href').contains(user._links.self.href);
  }

  function canGetReady(game, user) {
    return user && _(game.players).pluck('href').contains(user._links.self.href);
  }

  function addLinks(game, view, user) {
    var selfHref = view._links.self.href;
    if (user) {
      view.link('viewed-by', user._links.self.href);

      canJoin(game, user) && view.link('join', selfHref + '/join');
      canGetReady(game, user) && view.link('get-ready', selfHref + '/get-ready');
    }
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

        res.set('Content-Type', 'application/duelo-game+hal+json');
        res.json(_.defaults({ _contentType: 'duelo-game' }, view.toJSON()));
      });
    },
    join: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return handleErr(err, res); }

        if (!canJoin(game, req.user)) {
          return res.send(403, 'Already joined.');
        }

        game.players.push(buildPlayer(req.user));
        game.save(function (err, game) {
          if (err) { return handleErr(err, res); }

          res.send('ok');
        });
      });
    },
    getReady: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      return res.send(403);
    }
  };

  function register(app) {
    app.post('/api/games', routes.create);
    app.get('/api/games/:id', routes.get);
    app.put('/api/games/:id/join', routes.join);
    app.put('/api/games/:id/get-ready', routes.getReady);
  }

  return { register: register };
});
