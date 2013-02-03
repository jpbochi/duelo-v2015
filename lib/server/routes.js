define(function (require) {
  var index = require('./routes/index');

  function register(app) {
    app.get('/', index);

    app.get('/tests', function (req, res) { res.redirect('/tests/index.html'); });
  }

  return { register: register };
});
