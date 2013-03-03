define(function (require) {
  var mongoose = require('mongoose');
  var hal = require('hal');

  var gameStateSchema = mongoose.Schema({
    board: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    status: String,
    players: [{ name: String }],
    state: [ gameStateSchema ]
  });

  var gameStatus = {
    lobby: 'lobby'
  };

  gameSchema.methods.selfHref = function () {
    return '/api/games/' + this._id;
  };

  gameSchema.methods.toPubliView = function () {
    return new hal.Resource(this.toJSON(), this.selfHref);
  };

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    build: function () {
      return new Game({ status: gameStatus.lobby });
    },
    create: function (done) {
      this.build().save(done);
    },
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
