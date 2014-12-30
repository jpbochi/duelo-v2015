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
      return done && done();
    }

    mongo.db.connection.on('error', console.error.bind(console, 'connection error:'));
    mongo.connect(function (err) {
      throwIfError(err);
      console.log('mongo connected to ' + mongo.url());

      done && done();
    });
  }

  function disconnectMongo(done) {
    if (!mongo.isConnected()) {
      return done && done();
    }

    mongo.disconnect(function (err) {
      throwIfError(err);
      console.log('mongo disconnected');

      done && done();
    });
  }

  return {
    throwIfError: throwIfError,
    ensureMongoConnected: ensureMongoConnected,
    disconnectMongo: disconnectMongo,
    clearDb: function (done) {
      ensureMongoConnected(function () {
        var collectionsToClear = [
          mongo.users.model,
          mongo.games.model
        ];
        var remaining = collectionsToClear.length;

        collectionsToClear.forEach(function (collection) {
          collection.remove(function (err) {
            throwIfError(err);

            remaining -= 1;
            (remaining === 0) && done();
          });
        });
      });
    },
    saveAll: function (models, done) {
      var savedModels = [];
      var remaining = models.length;

      models.forEach(function (model) {
        model.save(function (err, saved) {
          throwIfError(err);

          savedModels.push(saved);
          remaining -= 1;
          (remaining === 0) && done(savedModels);
        });
      });
    }
  };
});

