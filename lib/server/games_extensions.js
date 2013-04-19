define(function (require) {
  'use strict';
  var builder = require('lib/server/duelo/game_builder.js');

  return {
    methods: {
      buildPlayer: function (user) {
        return {
          displayName: user.displayName,
          state: 'lobby',
          href: user._links.self.href
        };
      },
      setState: function (newState) {
        this.state = newState;
      },
      builder: function () {
        return builder(this);
      }
    }
  };
});
