define(function () {
  /*global requirejs*/
  var users = requirejs('./lib/server/usersCollection.js');

  QUnit.module('usersCollection.buildFromAuth');

  test('builds a unique key', function () {
    var user = users.buildFromAuth({ provider: 'test', id: '1234' });

    equal(user.key, 'test:1234');
  });
});
