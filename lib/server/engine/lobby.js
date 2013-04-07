define(function () {
  'use strict';
  var _ = require('lodash');

  var loggedPlayer = function (game, user) {
    return _(game.players).find(function (player) {
      return player.href === user._links.self.href;
    });
  };

  var hasJoined = function (game, user) {
    return _(game.players).pluck('href').contains(user._links.self.href);
  };

  var canJoin = function (game, user) {
    return user && !hasJoined(game, user);
  };

  var canGetReady = function (game, user) {
    return user &&
    hasJoined(game, user) &&
    (loggedPlayer(game, user).state === 'lobby');
  };

  var addLinks = function (game, view, user) {
    var selfHref = view._links.self.href;
    if (user) {
      view.link('viewed-by', user._links.self.href);

      canJoin(game, user) && view.link('join', selfHref + '/join');
      canGetReady(game, user) && view.link('get-ready', selfHref + '/get-ready');
    }
  };

  return function (game) {
    return {
      loggedPlayer: _.partial(loggedPlayer, game),
      canJoin: _.partial(canJoin, game),
      canGetReady: _.partial(canGetReady, game),
      addLinks: _.partial(addLinks, game)
    };
  };
});
