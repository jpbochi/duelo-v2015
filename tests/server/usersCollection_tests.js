define(function (require) {
  var _ = require('lodash');
  var support = require('../../tests/support/server.js');
  var mongo = require('../../lib/server/mongo.js');
  var users = mongo.users;

  var data = {
    userAuthProfile: {
      provider: 'facebook',
      id: '1303111482',
      username: 'jpbochi',
      displayName: 'João Paulo Bochi',
      gender: 'male',
      profileUrl: 'http://www.facebook.com/jpbochi',
      emails: [ { value: 'jpbochi@gmail.com' } ],
      '_json': {
        id: '1303111482',
        name: 'João Paulo Bochi',
        link: 'http://www.facebook.com/jpbochi',
        username: 'jpbochi',
        email: 'jpbochi@gmail.com',
        timezone: -3,
        locale: 'en_GB'
      }
    }
  };

  QUnit.module('mongo.users.buildFromAuth');

  test('builds from a facebook auth profile', function () {
    var user = users.buildFromAuth(data.userAuthProfile);

    equal(user.key, 'facebook:1303111482');
    equal(user.email, 'jpbochi@gmail.com');
    equal(user.displayName, 'João Paulo Bochi');
  });

  QUnit.module('mongo.users.loginWith', {
    setup: function () {
      stop();
      support.clearDb(start);
    }
  });

  test('creates a user if he/she is not registered', function () {
    stop();

    users.loginWith(data.userAuthProfile, function (err, user) {
      strictEqual(err, null);

      users.model.find({}, function (err, result) {
        start();
        strictEqual(err, null);

        deepEqual(_.pluck(result, 'key'), ['facebook:1303111482']);
        deepEqual(_.pluck(result, 'email'), ['jpbochi@gmail.com']);
        deepEqual(_.pluck(result, 'displayName'), ['João Paulo Bochi']);
      });
    });
  });

  test('returns existing user if he/she is registered', function () {
    ok('TODO');
  });
});
