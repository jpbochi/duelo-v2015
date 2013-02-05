define(function (require) {
  var index = require('./routes/index.js');
  var apiApp = require('./api/app.js');

  function register(app) {
    app.get('/', index);

    app.get('/tests', function (req, res) { res.redirect('/tests/index.html'); });

    apiApp.register(app);
  }

  return { register: register };
});
