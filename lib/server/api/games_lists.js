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

      res.set('Content-Type', 'application/hal+json');
      res.json(view.toJSON());
    },
  };

  function register(app) {
    app.get('/api/games/all', routes.all);
  }

  return { register: register };
});
