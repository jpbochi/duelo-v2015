define(function (require) {
  'use strict';
  var client = require('/client/api_client.js').extendHal();
  var lobby = require('/client/renderer/lobby.js');
  var ms = require('/external/mustache/mustache.js');

  var gameContainer = $('#game-container');
  var gameHref = gameContainer.data('gameHref');

  function renderTopNav(root) {
    var links = root._links;
    var link = $(ms.render('<li><a href="{{href}}" rel="{{rel}}">{{title}}</a></li>', links.games));
    $('#top-nav-links').append(link);

    link.find('a').click(function (ev) {
      ev.preventDefault();

      client.post(this.href).then(function (created) {
        window.location = '/play/' + created.href;
      });
    });
  }

  function renderGame(game) {
    if (game.state === 'lobby') {
      lobby.render(gameContainer, game);
    } else {
      gameContainer.html('<h3>Hold tight. Playing is under development.</h3>');
    }
  }

  function loadGame(href) {
    return client.get(href);
  }

  client.get('/api').done(renderTopNav);
  gameHref && loadGame(gameHref).done(renderGame);
});
