define(function () {
  'use strict';
  var express = require('express');
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var routes = {
    join: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }

        if (!game.engine(req.user).join()) {
          return res.send(403, 'Already joined.');
        }

        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }

          res.send('ok');
        });
      });
    },
    becomeReady: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }

        if (!game.engine(req.user).becomeReady()) {
          return res.send(403);
        }

        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }

          res.send('ok');
        });
      });
    }
  };

  function router() {
    var route = express.Router();
    //TODO: POST is a more correct action for the routes below since they fail if tried twice
    route.put('/games/:id/join', routes.join);
    route.put('/games/:id/become-ready', routes.becomeReady);
    return route;
  }

  return { router: router };
});
