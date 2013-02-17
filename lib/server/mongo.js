define(function (require) {
  var mongoose = require('mongoose');
  var users = require('./usersCollection.js');
  var games = require('./gamesCollection.js');

  return {
    db: mongoose,
    url: function () {
      var connection = this.db.connection;
      return [
        'mongodb://', connection.host,
        ':', connection.port,
        '/', connection.name
      ].join('');
    },
    connect: function (done) {
      mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/duelo_dev');
      mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
      mongoose.connection.once('open', done);
    },
    users: users,
    games: games
  };
});
