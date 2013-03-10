define(function (require) {
  var lo = require('/external/lodash/lodash.js');

  function callExpecting(request, action, expectedStatus) {
    stop();
    return request.always(function () {
      start();
    }).fail(function (jqXHR) {
      equal(jqXHR.status, expectedStatus, action + ' => ' + expectedStatus + '\n' + jqXHR.responseText);
    }).done(function (data, textStatus, jqXHR) {
      equal(jqXHR.status, expectedStatus, action + ' => ' + expectedStatus);
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
      this.request = get('/api');
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

  module('POST /api/games', {
    setup: function () {
      var context = this;
      context.username = 'Batima';
      logIn(context.username).then(createGame).then(function (data, textStatus, jqXHR) {
        context.data = data;
        context.jqXHR = jqXHR;
      });
    }
  });

  test('redirects to a created game', function () {
    var location = this.jqXHR.getResponseHeader('Location');
    notEqual(location, null, 'Location != null');

    get(location).done(function (data, textStatus, jqXHR) {
      var type = jqXHR.getResponseHeader('Content-Type');

      equal(type, 'application/hal+json');
      deepEqual(data._links.self, { href: location });
    });
  });

  test('adds logged user in the players list', function () {
    var context = this;
    var location = this.jqXHR.getResponseHeader('Location');

    get(location).done(function (data, textStatus, jqXHR) {
      deepEqual(lo.pluck(data.players, 'name'), [context.username]);
    });
  });

  module('GET /api/game/:id', {
    setup: function () {
      var context = this;
      createAndGetGame().then(function (data) {
        context.location = this.url;
        context.game = data;
      });
    }
  });

  test('has link to self', function () {
    deepEqual(this.game._links.self, { href: this.location });
  });

  test('has link to join game', function () {
    deepEqual(this.game._links.join, { href: this.location + '/join' });
  });
});
