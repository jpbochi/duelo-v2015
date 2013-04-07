define(function (require) {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');

  return {
    options: {
      toJSON: {
        hidden: ['_id'],
        transform: function (doc, ret, options) {
          options.hidden && options.hidden.forEach(function (prop) {
            delete ret[prop];
          });
        }
      }
    },
    methods: {
      selfHref: function () {
        return '/api/user/' + this.key;
      },
      toSessionData: function () {
        return new hal.Resource(
          _.omit(this.toJSON(), 'oauthJson'),
          this.selfHref()
        );
      }
    }
  };
});
