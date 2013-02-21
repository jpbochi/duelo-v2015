define(function () {
  /*global requirejs*/
  /*jshint nomen:false*/
  var support = requirejs('./tests/support/server.js');
  var mongo = requirejs('./lib/server/mongo.js');
  var users = mongo.users;

  QUnit.module('mongo.users.buildFromAuth');

  test('builds from a facebook auth profile', function () {
    var userAuthProfile = {
      provider: 'facebook',
      id: '1303111482',
      username: 'jpbochi',
      displayName: 'João Paulo Bochi',
      gender: 'male',
      profileUrl: 'http://www.facebook.com/jpbochi',
      emails: [ { value: 'jpbochi@gmail.com' } ],
      _json: {
        id: '1303111482',
        name: 'João Paulo Bochi',
        link: 'http://www.facebook.com/jpbochi',
        username: 'jpbochi',
        email: 'jpbochi@gmail.com',
        timezone: -2,
        locale: 'en_GB'
      }
    };

    var user = users.buildFromAuth(userAuthProfile);

    deepEqual(user.key, 'facebook:1303111482');
    deepEqual(user.email, 'jpbochi@gmail.com');
  });

  QUnit.module('mongo.users.insertOrMerge', {
    setup: function () {
      stop();
      support.clearDb(start);
    }
  });

  test('inserts user if it is new', function () {
    ok('TODO');
  });

  test('merges and updates user if it already existed', function () {
    ok('TODO');
  });
});
