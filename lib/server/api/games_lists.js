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

  var routes = {
    all: function (req, res) {
      var view = new hal.Resource({}, '/api/games/all');

      mongo.games.model.find({}, function (err, result) {
        if (err) { return handleErr(err, res); }

        result.forEach(function (game) {
          view.embed('game', game.toPublicListView());
        });

        res.set('Content-Type', 'application/duelo-games-list+hal+json');
        res.json(view.toJSON());
      });
    },
  };

  function register(app) {
    app.get('/api/games/all', routes.all);
  }

  return { register: register };
});
