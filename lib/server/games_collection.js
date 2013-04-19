define(function (require) {
  'use strict';
  var mongoose = require('mongoose');
  var _ = require('lodash');
  var view = require('lib/server/games_view.js');
  var extensions = require('lib/server/games_extensions.js');

  var gameSchema = mongoose.Schema({
    state: String,
    createdAt: Date,
    players: [{ displayName: String, state: String, href: String }],
    buildOptions: mongoose.Schema.Types.Mixed,
    board: mongoose.Schema.Types.Mixed
  });

  gameSchema.options = _.merge(gameSchema.options, extensions.options);
  gameSchema.methods = _.merge(gameSchema.methods, extensions.methods);

  gameSchema.options = _.merge(gameSchema.options, view.options);
  gameSchema.methods = _.merge(gameSchema.methods, view.methods);

  var Game = mongoose.model('Game', gameSchema);

  return {
    model: Game,
    create: function (values) {
      return new Game(_.defaults(
        values || {},
        {
          state: 'lobby',
          createdAt: Date.now()
        }
      ));
    },
    buildPlayer: gameSchema.methods.buildPlayer,
    get: function (id, done) {
      Game.findById(id, done);
    }
  };
});
