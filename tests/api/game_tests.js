define(function (require) {
  /*global hal */

  function callExpecting(request, action, expectedStatus) {
    stop();
    return request.always(function () {
      start();
    }).fail(function (jqXHR) {
      equal(jqXHR.status, expectedStatus, action + ' => ' + expectedStatus);
    }).done(function (data, textStatus, jqXHR) {
      equal(jqXHR.status, expectedStatus, action + ' => ' + expectedStatus);
    });
  }

  function get(url, expectedStatus) {
    return callExpecting($.get(url), 'GET ' + url, expectedStatus || 200);
  }

  function post(url, expectedStatus) {
    return callExpecting($.post(url), 'POST ' + url, expectedStatus || 200);
  }

  module('GET /api', {
    setup: function () {
      this.request = get('/api');
    }
  });

  test('lists root links', function () {
    this.request.done(function (data) {
      var resource = new hal.Resource(data);

      deepEqual(resource._links, {
        self: { href: '/api' },
        games: { href: '/api/games', title: 'Create game' }
      });
    });
  });

  module('POST /api/games', {
    setup: function () {
      this.request = post('/api/games', 201);
    }
  });

  test('redirects to a created game', function () {
    this.request.done(function (data, textStatus, jqXHR) {
      var location = jqXHR.getResponseHeader('Location');
      notEqual(location, null, 'Location != null');

      get(location).done(function (data, textStatus, jqXHR) {
        var type = jqXHR.getResponseHeader('Content-Type');
        var resource = new hal.Resource(data);

        equal(type, 'application/hal+json');
        deepEqual(resource._links.self, { href: location });
      });
    });
  });
});
