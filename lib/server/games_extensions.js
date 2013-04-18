define(function (require) {
  'use strict';
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
      }
    }
  };
});
