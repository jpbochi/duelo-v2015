define(function (require) {
  'use strict';
  /*global _*/

  var mu = require('/external/mustache/mustache.js');
  var client = require('/client/api_client.js').extendHal();
  var lobby = require('/client/renderer/lobby.js');
  var gamesList = require('/client/renderer/games_list.js');

  var container = $('#container');

  function renderTopNav(root) {
    var links = root._links;

    _(links).pick('all-games', 'games').values().forEach(function (link) {
      var anchor = $(mu.render('<li><a href="{{href}}" rel="{{rel}}">{{title}}</a></li>', link));
      $('#top-nav-links').append(anchor);
    });

    $('#top-nav-links a').click(function (ev) {
      ev.preventDefault();
    });

    $('#top-nav-links a[rel=games]').click(function () {
      client.post(this.href).then(function (created) {
        window.location = '/play/' + created.href;
      });
    });
    $('#top-nav-links a[rel=all-games]').click(function () {
      client.get(this.href).then(function (view) {
        var games = view._embedded;
        var template = $('#games-list-template').html();
        container.html(mu.render(template, games));
      });
    });
  }

  function renderGame(game) {
    if (game.state === 'lobby') {
      lobby.render(container, game);
    } else {
      container.html('<h3>Hold tight. Playing is under development.</h3>');
    }
  }

  function loadGame(href) {
    return client.get(href);
  }

  function init() {
    var gameHref = container.data('gameHref');
    client.get('/api').done(renderTopNav);
    gameHref && loadGame(gameHref).done(renderGame);
  }

  init();
});
