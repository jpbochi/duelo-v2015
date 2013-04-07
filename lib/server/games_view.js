define(function (require) {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');

  var embedded = ['players'];
  var omitted = ['_id'].concat(embedded);

  var playerView = function (player) {
    return new hal.Resource(
      _.omit(player.toJSON(), '_id', 'href'),
      player.href
    );
  };

  var embeddedPlayers = function (game) {
    return _.map(game.players, playerView);
  };

  return {
    options: {
      embedded: embedded,
      toJSON: {
        omit: omitted,
        transform: function (doc, ret, options) {
          if (options.pick) { ret = _.pick(ret, options.pick); }
          if (options.omit) { ret = _.omit(ret, options.omit); }
          return ret;
        }
      }
    },
    methods: {
      selfHref: function () {
        return '/api/games/' + this._id;
      },
      toPublicView: function () {
        return new hal.Resource(
          this.toJSON(),
          this.selfHref()
        ).embed('player', embeddedPlayers(this));
      },
      toPublicListView: function () {
        return new hal.Resource(
          this.toJSON({ pick: ['state', 'createdAt'] }),
          this.selfHref()
        ).embed('player', embeddedPlayers(this));
      }
    }
  };
});