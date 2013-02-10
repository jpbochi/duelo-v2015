define(function (require) {
  /*global process*/

  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

  // https://code.google.com/apis/console/
  var googleClient = {
    id: '468839478552-4et0rlhdi1v996m8elooqg20pjvauj2s.apps.googleusercontent.com',
    secret: 'RLVlgFBYE3BK31qZVx6GnJJ2',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  };

  function configure(app) {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    passport.use(
      new GoogleStrategy({
        clientID: googleClient.id,
        clientSecret: googleClient.secret,
        callbackURL: '/auth/google/callback'
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
  }

  function register(app) {
    app.get(
      '/auth/google',
      passport.authenticate('google', { scope: googleClient.scope })
    );

    app.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
        res.redirect('/');
      }
    );

    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  }

  return { configure: configure, register: register };
});
