define(function () {
  'use strict';
  var express = require('express');
  var hal = require('halberd');
  var rootLinks = new hal.Resource({}, '/api');
  rootLinks.link('games', { href: '/api/games', title: 'Create game' });
  rootLinks.link('all-games', { href: '/api/games/all', title: 'All games' });

  var rootJson = rootLinks.toJSON();

  var routes = {
    root: function (req, res) {
      res.set('Content-Type', 'application/hal+json');
      res.json(rootJson);
    }
  };

  function router() {
    var route = express.Router();
    route.get('/', routes.root);
    return route;
  }

  return { router: router };
});
