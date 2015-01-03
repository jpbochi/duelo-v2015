define(function () {
  'use strict';
  var express = require('express');
  var root = require('lib/server/api/root.js');
  var gamesLists = require('lib/server/api/games_lists.js');
  var games = require('lib/server/api/games.js');
  var lobby = require('lib/server/api/games_lobby.js');

  function router() {
    var route = express.Router();
    route.use(root.router());
    route.use(gamesLists.router());
    route.use(games.router());
    route.use(lobby.router());
    return route;
  }

  return { router: router };
});
