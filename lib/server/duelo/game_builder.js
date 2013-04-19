define(function () {
  'use strict';
  var _ = require('lodash');
  var tileName = require('./lib/tile_name.js');

  var defaultOptions = {
    dimensions: [30, 30]
  };

  var createBoard = function (options) {
    var cols = options.dimensions[0];
    var rows = options.dimensions[1];
    var tiles = _.range(cols).map(function (col) {
      return _.range(rows).map(function (row) {
        return tileName.fromPoint([col, row]);
      });
    });

    return { tiles: tiles };
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
