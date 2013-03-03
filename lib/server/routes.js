define(function (require) {
  function register(app) {
    app.get('/', function (req, res) {
      if (!req.user) {
        res.render('login');
      } else {
        res.render('index', { user: req.user });
      }
    });

    app.get('/tests', function (req, res) { res.redirect('/tests/index.html'); });

    app.get('/play/*', function (req, res) {
      if (!req.user) { return res.redirect('/'); }

      res.render('play', { user: req.user, gameHref: req.params[0] });
    });
  }

  return { register: register };
});
