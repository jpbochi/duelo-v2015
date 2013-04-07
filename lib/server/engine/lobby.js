define(function () {
  'use strict';
  var _ = require('lodash');

  function canJoin(game, user) {
    return user && !_(game.players).pluck('href').contains(user._links.self.href);
  }

  function canGetReady(game, user) {
    return user && _(game.players).pluck('href').contains(user._links.self.href);
  }

  function addLinks(game, view, user) {
    var selfHref = view._links.self.href;
    if (user) {
      view.link('viewed-by', user._links.self.href);

      canJoin(game, user) && view.link('join', selfHref + '/join');
      canGetReady(game, user) && view.link('get-ready', selfHref + '/get-ready');
    }
  }

  return function (game) {
    return {
      canJoin: _.partial(canJoin, game),
      canGetReady: _.partial(canGetReady, game),
      addLinks: _.partial(addLinks, game)
    };
  };
});
