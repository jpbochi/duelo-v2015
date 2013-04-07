define(function () {
  'use strict';
  var root = require('lib/server/api/root.js');
  var gamesLists = require('lib/server/api/games_lists.js');
  var games = require('lib/server/api/games.js');
  var lobby = require('lib/server/api/games_lobby.js');

  function register(app) {
    root.register(app);
    gamesLists.register(app);
    games.register(app);
    lobby.register(app);
  }

  return { register: register };
});
