define(function (require) {
  var _ = require('lodash');
  var sinon = require('sinon-restore');
  var should = require('../../tests/support/should.js');
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

  QUnit.module('mongo.users.loginWith()');

  test('creates a user if he not registered', function (done) {
    var expectedDate = Date.UTC(2013, 2, 28);
    sinon.stub(Date, 'now').returns(expectedDate);

    users.loginWith(data.authProfile, function (err, user) {
      strictEqual(err, null);

      deepEqual(
        _.pick(user, 'key', 'email', 'displayName'),
        {
          key: 'facebook:12345',
          email: 'j@duelo.com',
          displayName: 'John Doe'
        }
      );
      should.dateEqual(user.lastLogin, expectedDate);

      users.model.find({}, function (err, result) {
        strictEqual(err, null);

        deepEqual(_.pluck(result, 'key'), ['facebook:12345']);
        deepEqual(_.pluck(result, 'email'), ['j@duelo.com']);
        deepEqual(_.pluck(result, 'displayName'), ['John Doe']);
        should.dateEqual(result[0].lastLogin, expectedDate);
        done();
      });
    });
  });

  test('returns existing user if he registered', function (done) {
    new users.model({
      key: 'facebook:12345',
      email: 'previous@old.me',
      displayName: 'Previous Name',
      lastLogin: Date.UTC(1999, 5, 13)
    }).save(function (err) {
      strictEqual(err, null);

      var expectedDate = Date.UTC(2013, 10, 27);
      sinon.stub(Date, 'now').returns(expectedDate);

      users.loginWith(data.authProfile, function (err, user) {
        strictEqual(err, null);

        deepEqual(
          _.pick(user, 'key', 'email', 'displayName'),
          {
            key: 'facebook:12345',
            email: 'previous@old.me',
            displayName: 'Previous Name'
          }
        );
        should.dateEqual(user.lastLogin, expectedDate);

        users.model.find({}, function (err, result) {
          strictEqual(err, null);

          deepEqual(_.pluck(result, 'key'), ['facebook:12345']);
          deepEqual(_.pluck(result, 'email'), ['previous@old.me']);
          deepEqual(_.pluck(result, 'displayName'), ['Previous Name']);
          should.dateEqual(result[0].lastLogin, expectedDate);
          done();
        });
      });
    });
  });
});
