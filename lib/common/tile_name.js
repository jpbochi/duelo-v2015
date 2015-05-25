define(function (require) {
  'use strict';
  var base26 = require('./base26.js');
  var tileRegex = /^([a-z]+)([0-9]+)$/;
  tileRegex.compile(tileRegex);

  var fromPoint = function (point) {
    if (!Array.isArray(point)) { throw 'point must be an array'; }

    var col = point[0];
    var row = point[1];
    return base26.convert(col) + (row + 1);
  };

  var toPoint = function (tileName) {
    var match = tileRegex.exec(tileName);
    if (!match) { throw '`' + JSON.stringify(tileName) + '` is not a valid tile name'; }

    return [base26.parse(match[1]), parseInt(match[2], 10)];
  };

  return {
    base26: base26,
    fromPoint: fromPoint,
    toPoint: toPoint
  };
});
