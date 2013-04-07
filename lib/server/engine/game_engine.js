define(function () {
  'use strict';
  var lobby = require('lib/server/engine/lobby.js');

  return function (game) {
    if (game.state === 'lobby') {
      return lobby(game);
    }
  };
});
