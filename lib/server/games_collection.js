define(function (require) {
  var mongoose = require('mongoose');
  var hal = require('halberd');
  var lo = require('lodash');

  var gameBoardSchema = mongoose.Schema({
    tiles: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    state: String,
    players: [{ displayName: String }],
    board: [ gameBoardSchema ]
  });

  var gameStates = {
    lobby: 'lobby'
  };

  gameSchema.methods.selfHref = function () {
    return '/api/games/' + this._id;
  };

  gameSchema.methods.toPublicView = function () {
    var selfHref = this.selfHref();
    var view = new hal.Resource(this.toJSON(), selfHref);
    view.link('join', selfHref + '/join');
    return view;
  };

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    build: function (values) {
      return new Game(lo.defaults(values || {}, { state: gameStates.lobby }));
    },
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
