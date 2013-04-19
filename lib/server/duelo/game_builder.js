define(function () {
  'use strict';
  var _ = require('lodash');

  var defaultOptions = {
    dimensions: [30, 30]
  };

  var createBoard = function (options) {
    return { tiles: [] };
  };

  return function (game) {
    var options = _.defaults(game.buildOptions, defaultOptions);

    return {
      build: function () {
        game.board = createBoard(options);
      }
    };
  };
});
