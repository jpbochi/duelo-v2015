define(function () {
  'use strict';
  var _ = require('lodash');
  var mongo = require('lib/server/mongo.js');
  var common = require('lib/server/api/common.js');

  var routes = {
    join: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }
        if (!game.engine(req.user).canJoin()) {
          return res.send(403, 'Already joined.');
        }

        game.players.push(mongo.games.buildPlayer(req.user));
        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }

          res.send('ok');
        });
      });
    },
    getReady: function (req, res) {
      if (!req.user) { return res.send(401, 'Please, log in first.'); }

      mongo.games.get(req.params.id, function (err, game) {
        if (err) { return common.handleErr(err, res); }
        if (!game.engine(req.user).canGetReady()) {
          return res.send(403);
        }

        game.engine(req.user).loggedPlayer().state = 'ready';

        game.save(function (err, game) {
          if (err) { return common.handleErr(err, res); }

          res.send('ok');
        });
      });
    }
  };

  function register(app) {
    app.put('/api/games/:id/join', routes.join);
    app.put('/api/games/:id/get-ready', routes.getReady);
  }

  return { register: register };
});
