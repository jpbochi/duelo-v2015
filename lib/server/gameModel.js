define(function (require) {
	var mongoose = require('mongoose');

	var gameStateSchema = mongoose.Schema({
		board: mongoose.Schema.Types.Mixed
	});

	var gameSchema = mongoose.Schema({
		players: [{ name: String }],
		board: gameStateSchema
	});

	var Game = mongoose.model('Game', gameSchema);

	return { Game: Game };
});