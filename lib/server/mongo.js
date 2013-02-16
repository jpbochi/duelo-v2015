define(function (require) {
  var mongoose = require('mongoose');
  var users = require('./usersCollection.js');
  var games = require('./gamesCollection.js');

  //mongoose.on('error', console.log);
  //mongoose.on('connect', console.log);

  mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/test');

  return {
    connection: mongoose,
    users: users,
    games: games
  };
});
