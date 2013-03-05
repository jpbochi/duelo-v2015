define(function (require) {
  var mongoose = require('mongoose');
  var hal = require('halberd');

  var gameBoardSchema = mongoose.Schema({
    tiles: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    state: String,
    players: [{ name: String }],
    board: [ gameBoardSchema ]
  });

  var gameStates = {
    lobby: 'lobby'
  };

  gameSchema.methods.selfHref = function () {
    return '/api/games/' + this._id;
  };

  gameSchema.methods.toPublicView = function () {
    return new hal.Resource(this.toJSON(), this.selfHref());
  };

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    build: function () {
      return new Game({ state: gameStates.lobby });
    },
    create: function (done) {
      this.build().save(done);
    },
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
