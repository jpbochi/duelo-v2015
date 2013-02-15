define(function (require) {
  require('../../external/underscore/underscore-1.4.4.min.js');
  var redis = require('redis-url').connect(process.env.MYREDIS_URL); //defaults to localhost

  var defaults = {
    auth: {
      // https://code.google.com/apis/console/
      google: {
        id: '468839478552-4et0rlhdi1v996m8elooqg20pjvauj2s.apps.googleusercontent.com',
        secret: 'RLVlgFBYE3BK31qZVx6GnJJ2',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      },
      // https://developers.facebook.com/apps/288952914564688
      facebook: {
        id: '288952914564688',
        secret: 'f89cd8b59743f5ab4d9346e8492635d9',
        scope: [] // http://developers.facebook.com/docs/reference/login/#permissions
      }
    }
  };

  function loadHash(redisKey, done) {
    redis.hgetall(redisKey, function (err, reply) {
      if (err) { throw err; }

      var parsed = reply && _.keys(reply).reduce(function (memo, key) {
        memo[key] = JSON.parse(reply[key]);
        return memo;
      }, {});

      done(parsed || {});
    });
  }

  function saveHash(redisKey, hash, done) {
    var keys = _.keys(hash);
    var keysToProcess = keys.length;
    keys.forEach(function (key) {
      redis.hset(redisKey, key, JSON.stringify(hash[key]), function () {
        keysToProcess -= 1;
        (keysToProcess === 0) && done();
      });
    });
  }

  return {
    redis: redis,
    redisUrl: ['redis://', redis.host, ':', redis.port].join(''),
    configure: function (app, done) {
      this.read(function (config) {
        app.set('auth', config.auth);

        done();
      });
    },
    read: function (done) {
      loadHash('auth', function (hash) {
        var config = {};
        config.auth = _.defaults(hash, defaults.auth);

        done(config);
      });
    },
    save: function (configValues, done) {
      console.log('saving config to ', this.redisUrl, '...');

      saveHash('auth', configValues.auth || {}, done);
    }
  };
});
