define(function (require) {
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;

  function configure(app) {
    var auth = app.get('auth');

    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    passport.use(
      new GoogleStrategy({
        clientID: auth.google.id,
        clientSecret: auth.google.secret,
        callbackURL: '/auth/google/callback'
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      }
    ));

    passport.use(
      new FacebookStrategy({
        clientID: auth.facebook.id,
        clientSecret: auth.facebook.secret,
        callbackURL: '/auth/facebook/callback'
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      }
    ));

    app.use(passport.initialize());
    app.use(passport.session());
    console.log('passport initialized.');
  }

  function register(app) {
    var auth = app.get('auth');
    app.get(
      '/auth/google',
      passport.authenticate('google', { scope: auth.google.scope })
    );
    app.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      function (req, res) {
        res.redirect('/');
      }
    );

    app.get(
      '/auth/facebook',
      passport.authenticate('facebook', { scope: auth.facebook.scope })
    );
    app.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/login' }),
      function (req, res) {
        console.log('user logged from facebook');
        console.log(req.user);
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
