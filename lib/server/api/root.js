define(function () {
  var hal = require('hal');
  var rootLinks = new hal.Resource({}, '/api');
  rootLinks.link('games', { href: '/api/games', title: 'Create game' });

  var rootJson = rootLinks.toJSON();

  var routes = {
    root: function (req, res) {
      res.json(rootJson);
    }
  };

  function register(app) {
    app.get('/api', routes.root);
  }

  return { register: register };
});
