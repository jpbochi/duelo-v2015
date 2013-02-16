define(function (require) {
  var mongoose = require('mongoose');

  var gameStateSchema = mongoose.Schema({
    board: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    players: [{ name: String }],
    state: [ gameStateSchema ]
  });

  var Game = mongoose.model('Game', gameSchema);

  return {
    build: function () {
      return new Game();
    }
  };
});
