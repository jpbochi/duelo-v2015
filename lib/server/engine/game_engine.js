define(function () {
  'use strict';
  var _ = require('lodash');
  var lobby = require('lib/server/engine/lobby.js');

  var emptyEngine = {
    addLinks: _.identity
  };

  return function (game, user) {
    if (game.state === 'lobby') {
      return lobby(game, user);
    }
    return emptyEngine;
  };
});
