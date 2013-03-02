define(function () {
  var hal = require('hal');
  var rootLinks = new hal.Resource({}, '/api');
  rootLinks.link('games', '/api/games');
  var rootJson = rootLinks.toJSON();

  var routes = {
    root: function (req, res) {
      res.send(rootJson);
    },
    postGame: function (req, res) {
      res.set('Location', '/api/games/fake');
      res.send(201);
    },
    getGame: function (req, res) {
      res.set('Content-Type', 'application/vnd.game+json');
      res.json({});
    }
  };

  function register(app) {
    app.get('/api', routes.root);
    app.post('/api/games', routes.postGame);
    app.get('/api/games/:id', routes.getGame);
  }

  return { register: register };
});
