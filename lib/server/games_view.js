define(function (require) {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');

  var embedded = ['players'];
  var hidden = ['_id'].concat(embedded);

  var embeddedPlayers = function (game) {
    return _.map(game.players, function (player) {
      return new hal.Resource(
        _.omit(player.toJSON(), '_id', 'href'),
        player.href
      );
    });
  };

  return {
    options: {
      embedded: embedded,
      toJSON: {
        hidden: hidden,
        transform: function (doc, ret, options) {
          options.hidden && options.hidden.forEach(function (prop) {
            delete ret[prop];
          });
        }
      }
    },
    methods: {
      selfHref: function () {
        return '/api/games/' + this._id;
      },
      toPublicView: function () {
        var view = new hal.Resource(this.toJSON(), this.selfHref());
        return view.embed('player', embeddedPlayers(this));
      },
      toPublicListView: function () {
        return new hal.Resource(
          _.pick(this.toJSON(), 'state', 'createdAt'),
          this.selfHref()
        ).embed('player', embeddedPlayers(this));
      }
    }
  };
});
