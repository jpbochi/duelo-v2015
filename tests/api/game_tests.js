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
      var res = new hal.Resource(data);

      deepEqual(res._links, {
        self: { href: '/api' },
        games: { href: '/api/games' }
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
        equal(type, 'application/hal+json');
      });
    });
  });
});
