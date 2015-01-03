define(function (require) {
  'use strict';
  var _ = require('lodash');
  var express = require('express');
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var mongo = require('./mongo.js');
  var requireLazy = require;

  function isDev(app) {
    return app.get('env') === 'development';
  }

  function configure(app) {
    var auth = app.get('auth');
    var TestStrategy = isDev(app) && requireLazy('passport-local').Strategy;

    passport.serializeUser(function (user, done) {
      done(null, user.toSessionData());
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
    TestStrategy && passport.use(
      new TestStrategy(function (username, password, done) {
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

  function router(app) {
    var auth = app.get('auth');
    var route = express.Router();
    route.get(
      '/google',
      passport.authenticate('google', { scope: auth.google.scope })
    );
    route.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      function (req, res) {
        console.log('user logged from google');
        console.log(JSON.stringify(req.user));
        res.redirect('/');
      }
    );

    route.get(
      '/facebook',
      passport.authenticate('facebook', { scope: auth.facebook.scope })
    );
    route.get(
      '/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/' }),
      function (req, res) {
        console.log('user logged from facebook');
        console.log(JSON.stringify(req.user));
        res.redirect('/');
      }
    );

    if (isDev(app)) {
      route.get(
        '/test',
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
      route.post(
        '/test',
        passport.authenticate('local', { failureRedirect: '/auth/failed' }),
        function (req, res) {
          console.log('user logged from test');
          console.log(JSON.stringify(_.pick(req.user, 'displayName', 'key')));
          req.xhr ? res.json(req.user.toSessionData()) : res.redirect('/');
        }
      );
    }

    route.get('/logout', function (req, res) {
      req.logout();
      req.xhr ? res.json('OK') : res.redirect('/');
    });
    return route;
  }

  return { configure: configure, router: router };
});
