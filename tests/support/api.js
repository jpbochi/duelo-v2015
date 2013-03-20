define(function (require) {
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
      equal(url, '/*', ['<', url, '> is not a valid url'].join(''));
      return $.Deferred().reject();
    }
    return callExpecting($.get(url), 'GET ' + url, expectedStatus || 200);
  }

  function post(url, data, expectedStatus) {
    if (url && url.href) { url = url.href; }
    if (!url) {
      equal(url, '/*', ['<', url, '> is not a valid url'].join(''));
      return $.Deferred().reject();
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
      context.gameHref = jqXHR.getResponseHeader('Location');
    })
    .then(logOut)
    .then(function () {
      return get(context.gameHref);
    }).then(function (data) {
      context.gameHref = this.url;
      context.game = data;
    });
  }

  return {
    get: get,
    post: post,
    logIn: logIn,
    logOut: logOut,
    logOutAndContinue: logOutAndContinue,
    createGame: createGame,
    createTestGame: createTestGame
  };
});
