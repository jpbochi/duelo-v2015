define(function (require) {
  var _ = require('lodash');
  var support = require('../../tests/support/server.js');
  var mongo = require('../../lib/server/mongo.js');
  var users = mongo.users;

  var data = {
    authProfile: {
      provider: 'facebook',
      id: '12345',
      username: 'le-user',
      displayName: 'John Doe',
      emails: [ { value: 'j@duelo.com' } ],
      '_json': {
        id: '12345',
        name: 'John Doe',
        username: 'jd1',
        email: 'jd@duelo.com',
        timezone: -3,
        locale: 'en_GB'
      }
    }
  };

  QUnit.module('mongo.users.loginWith', {
    setup: function () {
      stop();
      support.clearDb(start);
    }
  });

  test('creates a user if he/she is not registered', function () {
    stop();

    users.loginWith(data.authProfile, function (err, user) {
      strictEqual(err, null);

      deepEqual(
        _.pick(user, 'key', 'email', 'displayName'),
        { key: 'facebook:12345', email: 'j@duelo.com', displayName: 'John Doe' }
      );

      users.model.find({}, function (err, result) {
        start();
        strictEqual(err, null);

        deepEqual(_.pluck(result, 'key'), ['facebook:12345']);
        deepEqual(_.pluck(result, 'email'), ['j@duelo.com']);
        deepEqual(_.pluck(result, 'displayName'), ['John Doe']);
        //TODO test lastLogin date
      });
    });
  });

  test('returns existing user if he/she is registered', function () {
    stop();

    new users.model({
      key: 'facebook:12345',
      email: 'previous@old.me',
      displayName: 'Previous Name'
    }).save(function (err) {
      strictEqual(err, null);

      users.loginWith(data.authProfile, function (err, user) {
        strictEqual(err, null);

        deepEqual(
          _.pick(user, 'key', 'email', 'displayName'),
          { key: 'facebook:12345', email: 'previous@old.me', displayName: 'Previous Name' }
        );

        users.model.find({}, function (err, result) {
          start();
          strictEqual(err, null);

          deepEqual(_.pluck(result, 'key'), ['facebook:12345']);
          deepEqual(_.pluck(result, 'email'), ['previous@old.me']);
          deepEqual(_.pluck(result, 'displayName'), ['Previous Name']);
          //TODO test lastLogin date
        });
      });
    });
  });
});
