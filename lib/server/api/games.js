define(function () {
  var hal = require('hal');

  var routes = {
    postGame: function (req, res) {
      res.set('Location', '/api/games/fake');
      res.send(201);
    },
    getGame: function (req, res) {
      res.set('Content-Type', 'application/hal+json');
      res.json({});
    }
  };

  function register(app) {
    app.post('/api/games', routes.postGame);
    app.get('/api/games/:id', routes.getGame);
  }

  return { register: register };
});
