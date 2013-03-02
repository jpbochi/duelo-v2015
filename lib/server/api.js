define(function () {
  var root = require('lib/server/api/root.js');
  var games = require('lib/server/api/games.js');

  function register(app) {
    root.register(app);
    games.register(app);
  }

  return { register: register };
});
