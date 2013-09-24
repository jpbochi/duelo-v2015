define(function () {
  'use strict';
  var _ = require('lodash');
  var lobby = require('lib/server/engine/lobby.js');

  var emptyEngine = function (game) {
    var emptyAction = function (action) {
      return function (done, dont) {
        return dont && dont('"' + action + '" not allowed when game is on "' + game.state + '"');
      }
    };
    return {
      addLinks: _.identity,
      join: emptyAction('join')
    }
  };

  return function (game, user) {
    if (game.state === 'lobby') {
      return lobby(game, user);
    }
    return emptyEngine(game);
  };
});
