define(function (require) {
  var mongo = require('../../lib/server/mongo.js');
  require('../../external/qunit/sinon-1.5.2.js');
  //require('../../external/qunit/sinon-qunit-1.0.0.js');

  function throwIfErr(err) {
    if (err) {
      console.error(err);
      throw err;
    }
  }

  function ensureMongoConnected(done) {
    if (mongo.isConnected()) {
      return done();
    }

    mongo.db.connection.on('error', console.error.bind(console, 'connection error:'));
    mongo.connect(function (err) {
      throwIfErr(err);

      console.log('mongo connected to ' + mongo.url());
      done();
    });
  }

  return {
    clearDb: function (done) {
      ensureMongoConnected(function () {
        mongo.users.model.remove(function (err) {
          throwIfErr(err);

          done();
        });
      });
    }
  };
});

