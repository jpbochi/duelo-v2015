define(function () {
  'use strict';
  var express = require('express');
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var routes = {
    create: function (req, res) {
      var players = [];
      req.user && players.push(mongo.games.buildPlayer(req.user));

      mongo.games.create({ players: players }).save(function (err, game) {
        if (err) { return common.handleErr(err, res); }

        res.set('Location', game.selfHref());
        res.sendStatus(201);
      });
    },
    get: function (req, res) {
      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }
        if (!game) { return res.send(404); } //TODO test and repeat that elsewhere

        var view = req.user ? game.toUserView(req.user) : game.toPublicView();

        res.set('Content-Type', 'application/json');
        res.json(_.defaults({ _contentType: 'duelo-game' }, view.toJSON()));
      });
    }
  };

  function router() {
    var route = express.Router();
    route.post('/games', routes.create);
    route.get('/games/:id', routes.get);
    return route;
  }

  return { router: router };
});
