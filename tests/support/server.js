define(function (require) {
  var mongo = require('../../lib/server/mongo.js');

  function throwIfError(err) {
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
      throwIfError(err);
      console.log('mongo connected to ' + mongo.url());

      done();
    });
  }

  return {
    clearDb: function (done) {
      ensureMongoConnected(function () {
        mongo.users.model.remove(function (err) {
          throwIfError(err);

          done();
        });
      });
    }
  };
});

