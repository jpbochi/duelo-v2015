define(function (require) {
  /*global process*/

  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var clients = require('./config.js').authClients;

  function configure(app) {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    passport.use(
      new GoogleStrategy({
        clientID: clients.google.id,
        clientSecret: clients.google.secret,
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
        clientID: clients.facebook.id,
        clientSecret: clients.facebook.secret,
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
  }

  function register(app) {
    app.get(
      '/auth/google',
      passport.authenticate('google', { scope: clients.google.scope })
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
      passport.authenticate('facebook', { scope: clients.facebook.scope })
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
