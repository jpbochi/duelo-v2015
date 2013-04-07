define(function (require) {
  'use strict';
  var mongoose = require('mongoose');
  var _ = require('lodash');
  var view = require('lib/server/games_view.js');

  var gameBoardSchema = mongoose.Schema({
    tiles: mongoose.Schema.Types.Mixed
  });

  var gameSchema = mongoose.Schema({
    state: String,
    createdAt: Date,
    players: [{ displayName: String, href: String }],
    board: [ gameBoardSchema ]
  });

  gameSchema.options = _.defaults(gameSchema.options, view.options);
  gameSchema.methods = _.defaults(gameSchema.methods, view.methods);

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    build: function (values) {
      return new Game(_.defaults(
        values || {},
        {
          state: 'lobby',
          createdAt: Date.now()
        }
      ));
    },
    buildPlayer: function (user) {
      return {
        displayName: user.displayName,
        href: user._links.self.href
      };
    },
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
