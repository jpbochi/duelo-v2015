define(function (require) {
  var mongoose = require('mongoose');
  var users = require('./usersCollection.js');
  var games = require('./gamesCollection.js');
  var states = { //http://mongoosejs.com/docs/api.html#connection_Connection-readyState
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnecting: 3
  };

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
      mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/duelo_dev', done);
    },
    isConnected: function () {
      return mongoose.connection.readyState === states.connected;
    },
    users: users,
    games: games
  };
});