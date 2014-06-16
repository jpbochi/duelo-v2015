define(function (require) {
  'use strict';
  /*global _*/

  var mu = require('/external/mustache/mustache.js');
  var client = require('/client/api_client.js').extendHal();
  var renderers = {
    lobby: require('/client/renderer/lobby.js'),
    playing: require('/client/renderer/playing.js')
  };

  var container = $('#container');

  function renderTopNav(root) {
    var links = root.links();

    _(links).filter(function (link) {
      return _.contains(['all-games', 'games'], link.rel);
    }).forEach(function (link) {
      var anchor = $(mu.render('<li><a href="{{href}}" rel="{{rel}}">{{title}}</a></li>', link));
      $('#top-nav-links').append(anchor);
    });

    //TODO: replace this by hash navigation, somehow
    $('#top-nav-links a').click(function (ev) {
      ev.preventDefault();
    });
    $('#top-nav-links a[rel=games]').click(function () {
      client.post(this.href).then(function (created) {
        location.hash = '#' + created.href;
      });
    });
    $('#top-nav-links a[rel=all-games]').click(function () {
      var href = $(this).attr('href');
      location.hash = '#' + href;
    });
  }

  function onHashChange(ev) {
    var href = window.location.hash.substr(1);

    if (href.substr(0, 4) === '/api') {
      renderLoading();
      client.get(href).done(renderView);
    }
  }

  function renderView(view) {
    if (view._contentType === 'duelo-game') {
      return renderGame(view);
    }
    if (view._contentType === 'duelo-games-list') {
      return renderGamesList(view);
    }
  }

  function renderLoading() {
    var template = $('#loading-template').html();
    container.html(mu.render(template));
  }

  function renderGamesList(view) {
    var games = view._embedded;
    var template = $('#games-list-template').html();
    container.html(mu.render(template, games));
  }

  function renderGame(game) {
    var renderer = renderers[game.state];

    renderer && renderer.render(container, game, renderGame);
  }

  function init() {
    window.onhashchange = onHashChange;
    onHashChange();
    client.get('/api').done(renderTopNav);
  }

  init();
});
