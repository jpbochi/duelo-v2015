define(function (require) {
  /*global _*/
  'use strict';
  var api = require('/tests/support/api.js');

  function stringify(value) {
    if (_.isFunction(value.value)) { value = value.value(); }
    return JSON.stringify(value, null, 2);
  }

  function should(value, transform, description) {
    description = description || JSON.stringify(value);

    ok(
      transform(value),
      [
        description, ' was expected to ', transform.name,
        '\nActual: ', stringify(value)
      ].join('')
    );
  }

  function bePlainObject(value) { return _.isPlainObject(value); }

  module('GET /api/games/all', {
    setup: function () {
      api.delete('/api/delete-all').always(start);
    }
  });

  test('lists all games', function () {
    api.post('/api/seed').then(function () {
      api.get('/api/games/all').done(function (data) {
        deepEqual(data._links, { 'self': { href: '/api/games/all' } }, 'data._links');

        should(data._embedded, bePlainObject, 'data._embedded');
        should(data._embedded.game, _.isArray, 'data._embedded.game');

        should(
          _(data._embedded.game).pluck('_links').pluck('self').pluck('href'),
          function allMatchGameHref(links) {
            return links.all(function (href) {
              return (/^\/api\/games\/[0-9a-zA-Z]{24}$/).test(href);
            });
          },
          'data._embedded.game#_links#self#href'
        );
      }).always(start);
    });
  });
});
