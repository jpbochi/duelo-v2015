define(function (require) {
  /*global _*/
  'use strict';

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

  function validateUrl(url, done) {
    if (url && url.href) { url = url.href; }
    if (!url) {
      equal(url, '/*', ['<', url, '> is not a valid url'].join(''));
      return $.Deferred().reject();
    }
    return done(url);
  }

  function get(url, expectedStatus) {
    return validateUrl(url, function (url) {
      return callExpecting($.get(url), 'GET ' + url, expectedStatus || 200);
    });
  }

  function post(url, data, expectedStatus) {
    return validateUrl(url, function (url) {
      return callExpecting($.post(url, data), 'POST ' + url, expectedStatus || 200);
    });
  }

  function put(url, data, expectedStatus) {
    return validateUrl(url, function (url) {
      return callExpecting(
        $.ajax({ type: 'PUT', url: url }),
        'PUT ' + url,
        expectedStatus || 200
      );
    });
  }

  function del(url, expectedStatus) {
    return validateUrl(url, function (url) {
      return callExpecting(
        $.ajax({ type: 'DELETE', url: url }),
        'DELETE ' + url,
        expectedStatus || 200
      );
    });
  }

  function logIn(context) {
    var username = context.username || context;
    return post(
      '/auth/test',
      { username: username, password: '***' }
    ).then(function (data) {
      if (_.isPlainObject(context)) { context.user = data; }
      return this;
    });
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
    return post('/api-test/seed?games=1')
    .then(function (data, textStatus, jqXHR) {
      context.gameHref = '/api/games/' + data[0]._id;
      return getGame(context);
    });
  }

  function getGame(context) {
    return get(context.gameHref).done(function (data) {
      context.gameHref = this.url;
      context.game = data;
      return this;
    });
  }

  return {
    get: get,
    post: post,
    put: put,
    delete: del,
    logIn: logIn,
    logOut: logOut,
    logOutAndContinue: logOutAndContinue,
    createGame: createGame,
    getGame: getGame,
    createTestGame: createTestGame
  };
});
