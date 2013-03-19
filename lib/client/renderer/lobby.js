define(function (require) {
  'use strict';
  var mu = require('/external/mustache/mustache.js');
  var template = $('#lobby-template').html();

  return {
    render: function (container, game) {
      var view = game;

      container.html(mu.render(template, view));
    }
  };
});
