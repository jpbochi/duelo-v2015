define(function () {
  'use strict';
  var express = require('express');
  var hal = require('halberd');
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var routes = {
    all: function (req, res) {
      var view = new hal.Resource({}, '/api/games/all');

      mongo.games.model.find({}, function (err, result) {
        if (err) { return common.handleErr(err, res); }

        result.forEach(function (game) {
          view.embed('game', game.toPublicListView());
        });

        res.set('Content-Type', 'application/json');
        res.json(_.defaults({ _contentType: 'duelo-games-list' }, view.toJSON()));
      });
    }
  };

  function router(app) {
    var route = express.Router();
    route.get('/games/all', routes.all);
    return route;
  }

  return { router: router };
});
