define(function (require) {
  'use strict';
  var _ = require('lodash');
  var express = require('express');
  var passport = require('passport');
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  var FacebookStrategy = require('passport-facebook').Strategy;
  var mongo = require('./mongo.js');
  var requireLazy = require;

  function middleware(options, isDev) {
    var TestStrategy = isDev && requireLazy('passport-local').Strategy;

    passport.serializeUser(function (user, done) {
      done(null, user.toSessionData());
    });
    passport.deserializeUser(function (obj, done) {
      done(null, obj);
    });

    passport.use(
      new GoogleStrategy({
        clientID: options.google.id,
        clientSecret: options.google.secret,
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
        clientID: options.facebook.id,
        clientSecret: options.facebook.secret,
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

    var route = express.Router();
    route.use(passport.initialize());
    route.use(passport.session());
    console.log('passport initialized.');
    return route;
  }

  function router(options, isDev) {
    var route = express.Router();
    route.get(
      '/google',
      passport.authenticate('google', { scope: options.google.scope })
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
      passport.authenticate('facebook', { scope: options.facebook.scope })
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

    if (isDev) {
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

  return { middleware: middleware, router: router };
});
