define(function (require) {
  'use strict';
  var mu = require('/external/mustache/mustache.js');
  var _ = require('/external/lodash/dist/lodash.js');
  var template = $('#playing-template').html();

  var lobby = {
    render: function (container, game, refresh) {
      var view = game;

      container.html(mu.render(template, view));
    }
  };
  return lobby;
});
