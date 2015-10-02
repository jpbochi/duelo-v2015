define(function (require) {
  'use strict';
  var mongoose = require('mongoose');
  var users = require('./users_collection.js');
  var games = require('./games_collection.js');
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
      mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://mongodb/duelo_dev', done);
    },
    disconnect: function (done) {
      mongoose.disconnect(done);
    },
    isConnected: function () {
      return mongoose.connection.readyState === states.connected;
    },
    users: users,
    games: games
  };
});
