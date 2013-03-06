define(function (require) {
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
        done(null, new mongo.users.model({ displayName: username }));
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
        console.log(req.user);
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
        console.log(req.user);
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
        passport.authenticate('local', { failureRedirect: '/' }),
        function (req, res) {
          console.log('user logged from test');
          console.log(req.user);
          req.xhr ? res.send('ok') : res.redirect('/');
        }
      );
    }

    app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
    });
  }

  return { configure: configure, register: register };
});
