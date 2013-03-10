define(function (require) {
  var _ = require('lodash');
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var mongo = require('./mongo.js');

  function isDev(app) {
    return app.get('env') === 'development';
  }

  function configure(app) {
    var auth = app.get('auth');
    var testStrategy = isDev(app) ? require('passport-local').Strategy : null;

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
          mongo.users.loginWith(profile, done);
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
          mongo.users.loginWith(profile, done);
        });
      }
    ));
    testStrategy && passport.use(
      new testStrategy(function (username, password, done) {
        process.nextTick(function () {
          var id = new mongo.db.Types.ObjectId().toString();
          var profile = {
            provider: 'test',
            id: id,
            emails: [{ value: id + '@example.org' }],
            displayName: username
          };
          mongo.users.loginWith(profile, done);
        });
      })
    );

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
      passport.authenticate('google', { failureRedirect: '/' }),
      function (req, res) {
        console.log('user logged from google');
        console.log(JSON.stringify(req.user));
        res.redirect('/');
      }
    );

    app.get(
      '/auth/facebook',
      passport.authenticate('facebook', { scope: auth.facebook.scope })
    );
    app.get(
      '/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/' }),
      function (req, res) {
        console.log('user logged from facebook');
        console.log(JSON.stringify(req.user));
        res.redirect('/');
      }
    );

    if (isDev(app)) {
      app.get(
        '/auth/test',
        function (req, res) {
          res.send([
            '<form method="post" action="/auth/test">',
            '<input type="text" name="username" placeholder="username" />',
            '<input type="password" name="password" />',
            '<input type="submit" value="go" />',
            '</form>'
          ].join(''));
        }
      );
      app.post(
        '/auth/test',
        passport.authenticate('local', { failureRedirect: '/auth/failed' }),
        function (req, res) {
          console.log('user logged from test');
          console.log(JSON.stringify(_.pick(req.user, 'displayName', 'key')));
          req.xhr ? res.json(req.user) : res.redirect('/');
        }
      );
    }

    app.get('/auth/logout', function (req, res) {
      req.logout();
      req.xhr ? res.json('OK') : res.redirect('/');
    });
  }

  return { configure: configure, register: register };
});
