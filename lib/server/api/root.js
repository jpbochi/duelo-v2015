define(function () {
  'use strict';
  var hal = require('halberd');
  var rootLinks = new hal.Resource({}, '/api');
  rootLinks.link('games', { href: '/api/games', title: 'Create game' });

  var rootJson = rootLinks.toJSON();

  var routes = {
    root: function (req, res) {
      res.set('Content-Type', 'application/hal+json');
      res.json(rootJson);
    }
  };

  function register(app) {
    app.get('/api', routes.root);
  }

  return { register: register };
});
