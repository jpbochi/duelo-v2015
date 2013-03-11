define(function (require) {
  var _ = require('/external/lodash/lodash.js');

  function callExpecting(request, action, expectedStatus) {
    function verify(jqXHR) {
      if (jqXHR.status !== expectedStatus) {
        equal(
          jqXHR.status,
          expectedStatus,
          [ action, ' expected ', expectedStatus,
            ', not ', jqXHR.status,
            '. Body was:\n', jqXHR.responseText
          ].join('')
        );
      }
    }

    stop();
    return request.fail(function (jqXHR) {
      verify(jqXHR);
    }).done(function (data, textStatus, jqXHR) {
      verify(jqXHR);
    });
  }

  function get(url, expectedStatus) {
    if (url && url.href) { url = url.href; }
    if (!url) {
      ok(url, ['<', url, '> should be a string'].join(''));
      return $.Deferred().resolve({});
    }
    return callExpecting($.get(url), 'GET ' + url, expectedStatus || 200);
  }

  function post(url, data, expectedStatus) {
    if (url && url.href) { url = url.href; }
    if (!url) {
      ok(url, ['<', url, '> should be a string'].join(''));
      return $.Deferred().resolve({});
    }
    return callExpecting($.post(url, data), 'POST ' + url, expectedStatus || 200);
  }

  function logIn(username) {
    return post('/auth/test', { username: username, password: '***' });
  }

  function logOut() {
    return get('/auth/logout');
  }

  function logOutAndContinue() {
    return logOut().always(start);
  }

  function createGame() {
    return post('/api/games', null, 201);
  }

  function createTestGame(context) {
    return logIn('someone else')
    .then(createGame)
    .then(function (data, textStatus, jqXHR) {
      return get(jqXHR.getResponseHeader('Location'));
    }).then(function (data) {
      context.gameHref = this.url;
      context.game = data;
    }).then(logOut);
  }

  module('GET /api');

  test('lists root links', function () {
    get('/api').done(function (data) {
      deepEqual(data._links, {
        self: { href: '/api' },
        games: { href: '/api/games', title: 'Create game' }
      });
    }).always(start);
  });

  module('logged POST /api/games', {
    setup: function () {
      var context = this;
      context.username = 'Batima';
      logIn(context.username)
      .then(createGame)
      .then(function (data, textStatus, jqXHR) {
        context.data = data;
        context.jqXHR = jqXHR;
        context.gameHref = jqXHR.getResponseHeader('Location');
      }).always(start);
    },
    teardown: logOutAndContinue
  });

  test('redirects to a created game', function () {
    var context = this;
    notEqual(context.gameHref, null, 'Location != null');

    get(context.gameHref).done(function (data, textStatus, jqXHR) {
      var type = jqXHR.getResponseHeader('Content-Type');

      equal(type, 'application/hal+json');
      deepEqual(data._links.self, { href: context.gameHref });
    }).always(start);
  });

  test('starts with logged user in the players list', function () {
    var context = this;

    get(context.gameHref).done(function (data, textStatus, jqXHR) {
      deepEqual(_.pluck(data.players, 'displayName'), [context.username]);
    }).always(start);
  });

  module('GET /api/game/:id', {
    setup: function () {
      var context = this;
      createTestGame(context).always(start);
    }
  });

  test('has link to self', function () {
    deepEqual(this.game._links.self, { href: this.gameHref });
  });

  test('has link to join game', function () {
    deepEqual(this.game._links.join, { href: this.gameHref + '/join' });
  });

  module('logged POST /api/game/:id/join', {
    setup: function () {
      var context = this;
      context.username = 'Joker';

      context.request = createTestGame(context).then(
        _.partial(logIn, context.username)
      ).then(function (data) {
        return post(context.game._links.join);
      }).always(start);
    },
    teardown: logOutAndContinue
  });

  test('adds logged user to game players list', function () {
    var context = this;
    var initialPlayers = _.pluck(context.game.players, 'displayName');
    var expectedPlayers = initialPlayers.concat(context.username);

    get(context.gameHref).done(function (data) {
      deepEqual(_.pluck(data.players, 'displayName'), expectedPlayers);
    }).always(start);
  });

  test('attempt to join twice is 403 forbidden', function () {
    var context = this;
    post(context.game._links.join, null, 403).always(start);
    ok(true);
  });

  module('unlogged POST /api/game/:id/join', {
    setup: function () {
      var context = this;

      createTestGame(context).always(start);
    },
    teardown: logOutAndContinue
  });

  test('is 401 unathorized', function () {
    var context = this;
    post(context.game._links.join, null, 401).always(start);
    ok(true);
  });
});
