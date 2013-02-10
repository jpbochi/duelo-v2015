define(function (require) {
  var apiApp = require('./api/app.js');

  function register(app) {
    app.get('/', function (req, res) {
      res.render('index', { user: req.user });
    });

    app.get('/tests', function (req, res) { res.redirect('/tests/index.html'); });

    apiApp.register(app);
  }

  return { register: register };
});
