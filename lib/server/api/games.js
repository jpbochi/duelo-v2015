define(function () {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  function buildPlayer(user) {
    return {
      displayName: user.displayName,
      href: user._links.self.href
    };
  }

  var routes = {
    create: function (req, res) {
      var players = [];
      req.user && players.push(buildPlayer(req.user));

      mongo.games.build({ players: players }).save(function (err, game) {
        if (err) { return common.handleErr(err, res); }

        res.set('Location', game.selfHref());
        res.send(201);
      });
    },
    get: function (req, res) {
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }

        var view = req.user ? game.toUserView(req.user) : game.toPublicView();

        res.set('Content-Type', 'application/duelo-game+hal+json');
        res.json(_.defaults({ _contentType: 'duelo-game' }, view.toJSON()));
      });
    },
    join: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }

        if (!game.engine().canJoin(req.user)) {
          return res.send(403, 'Already joined.');
        }

        game.players.push(buildPlayer(req.user));
        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }

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
