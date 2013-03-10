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
    return callExpecting($.get(url), 'GET ' + url, expectedStatus || 200);
  }

  function post(url, data, expectedStatus) {
    return callExpecting($.post(url, data), 'POST ' + url, expectedStatus || 200);
  }

  function logIn(username) {
    return post('/auth/test', { username: username, password: '***' });
  }

  function logOutAndContinue() {
    return get('/auth/logout').always(start);
  }

  function createGame() {
    return post('/api/games', null, 201);
  }

  function createAndGetGame() {
    return createGame().then(function (data, textStatus, jqXHR) {
      return get(jqXHR.getResponseHeader('Location'));
    });
  }

  module('GET /api', {
    setup: function () {
      this.request = get('/api').always(start);
    }
  });

  test('lists root links', function () {
    this.request.done(function (data) {
      deepEqual(data._links, {
        self: { href: '/api' },
        games: { href: '/api/games', title: 'Create game' }
      });
    });
  });

  module('logged POST /api/games', {
    setup: function () {
      var context = this;
      context.username = 'Batima';
      context.request = logIn(context.username).then(createGame).then(function (data, textStatus, jqXHR) {
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

  test('adds logged user in the players list', function () {
    var context = this;

    get(context.gameHref).done(function (data, textStatus, jqXHR) {
      deepEqual(_.pluck(data.players, 'displayName'), [context.username]);
    }).always(start);
  });

  module('GET /api/game/:id', {
    setup: function () {
      var context = this;
      createAndGetGame().then(function (data) {
        context.gameHref = this.url;
        context.game = data;
      }).always(start);
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

      context.request = createAndGetGame().then(function (data) {
        context.gameHref = this.url;
        context.game = data;
      }).then(
        _.partial(logIn, context.username)
      ).then(function (data) {
        return post(context.game._links.join.href);
      }).always(start);
    },
    teardown: logOutAndContinue
  });

  test('adds logged user to game players', function () {
    var context = this;
    get(context.gameHref).done(function (data) {
      deepEqual(_.pluck(data.players, 'displayName'), [context.username]);
    }).always(start);
  });

  module('unlogged POST /api/game/:id/join', {
    setup: function () {
      var context = this;
      context.username = 'Joker';

      createAndGetGame().then(function (data) {
        context.gameHref = this.url;
        context.game = data;
      }).always(start);
    },
    teardown: logOutAndContinue
  });

  test('is 401 unathorized', function () {
    var context = this;
    post(context.game._links.join.href, null, 401).always(start);
    ok(true);
  });
});
