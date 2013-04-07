define(function (require) {
  'use strict';
  var hal = require('halberd');
  var _ = require('lodash');

  return {
    options: {
      toJSON: {
        omit: ['_id'],
        transform: function (doc, ret, options) {
          if (options.omit) { ret = _.omit(ret, options.omit); }
          return ret;
        }
      }
    },
    methods: {
      selfHref: function () {
        return '/api/user/' + this.key;
      },
      toSessionData: function () {
        return new hal.Resource(
          this.toJSON({ omit: ['_id', 'oauthJson'] }),
          this.selfHref()
        );
      }
    }
  };
});
