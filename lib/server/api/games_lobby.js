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

        if (!game) {
          return res.send(404);
        }

        if (!game.engine(req.user).join) {
          return res.send(500, '"join" not defined for game is in "' + game.state + '" state.');
        }

        return game.engine(req.user).join(function () {
          game.save(function (err, game) {
            if (err) { return common.handleErr(err, res); }

            res.send('ok');
          });
        }, function (whyNot) {
          res.send(403, whyNot);
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

  function register(app) {
    app.put('/api/games/:id/join', routes.join);
    app.put('/api/games/:id/become-ready', routes.becomeReady);
  }

  return { register: register };
});
