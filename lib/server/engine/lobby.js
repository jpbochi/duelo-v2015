define(function () {
  'use strict';
  var _ = require('lodash');

  return function (game, user) {
    var loggedPlayer = _.once(function () {
      return user && _(game.players).find(function (player) {
        return player.href === user._links.self.href;
      });
    });
    var canJoin = _.once(function () {
      return user && !loggedPlayer();
    });
    var canGetReady = _.once(function () {
      return user &&
      loggedPlayer() &&
      (loggedPlayer().state === 'lobby');
    });

    return {
      loggedPlayer: loggedPlayer,
      canJoin: canJoin,
      canGetReady: canGetReady,
      addLinks: function (view) {
        var selfHref = view._links.self.href;

        if (user) {
          view.link('viewed-by', user._links.self.href);

          canJoin() && view.link('join', selfHref + '/join');
          canGetReady() && view.link('get-ready', selfHref + '/get-ready');
        }
      }
    };
  };
});
