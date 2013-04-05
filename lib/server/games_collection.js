define(function (require) {
  'use strict';
  var mongoose = require('mongoose');
  var hal = require('halberd');
  var _ = require('lodash');

  var gameBoardSchema = mongoose.Schema({
    tiles: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    state: String,
    createdAt: Date,
    players: [{ displayName: String, key: String }],
    board: [ gameBoardSchema ]
  });

  var gameStates = {
    lobby: 'lobby'
  };

  gameSchema.options.toJSON = {
    hide: ['_id'],
    transform: function (doc, ret, options) {
      options.hide && options.hide.forEach(function (prop) {
        delete ret[prop];
      });
    }
  };

  gameSchema.methods.selfHref = function () {
    return '/api/games/' + this._id;
  };

  gameSchema.methods.toPublicView = function () {
    return new hal.Resource(this.toJSON(), this.selfHref());
  };

  gameSchema.methods.toPublicListView = function () {
    return new hal.Resource(_.pick(this.toJSON(), 'state'), this.selfHref());
  };

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    build: function (values) {
      return new Game(_.defaults(
        values || {},
        {
          state: gameStates.lobby,
          createdAt: Date.now()
        }
      ));
    },
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
