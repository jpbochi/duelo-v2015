define(function (require) {
  'use strict';
  var mu = require('/external/mustache/mustache.js');
  var _ = require('/external/lodash/lodash.js');
  var template = $('#lobby-template').html();

  var lobby = {
    render: function (container, game) {
      var view = game;

      container.html(mu.render(template, view));

      container.find('.btn[rel=join],.btn[rel=get-ready]').click(function (el) {
        el.preventDefault();

        var button = $(this);
        button.attr('disabled', 'disabled');

        $.ajax({
          method: 'put',
          url: button.attr('href')
        }).always(function () {
          button.removeAttr('disabled');
        }).fail(function (jqXHR) {
          console.log('Failed to ' + button.attr('rel') + ':', jqXHR.status, jqXHR.responseText);
        }).done(function () {
          game._links.self.get().then(_.partial(lobby.render, container));
        });
      });
    }
  };
  return lobby;
});
