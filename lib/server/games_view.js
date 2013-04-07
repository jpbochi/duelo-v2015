define(function (require) {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');

  var embedded = ['players'];
  var hidden = ['_id'];//TODO .concat(embedded);

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
        return new hal.Resource(this.toJSON(), this.selfHref());
      },
      toPublicListView: function () {
        return new hal.Resource(
          _.pick(this.toJSON(), 'state', 'createdAt'),
          this.selfHref()
        );
      }
    }
  };
});
