define(function (require) {
  'use strict';
  let _ = require('lodash');
  let inspect = require('util').inspect;
  let express = require('express');
  let passport = require('passport');
  let GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
  let FacebookStrategy = require('passport-facebook').Strategy;
  let mongo = require('./mongo.js');
  let requireLazy = require;

  function middleware(options, isDev) {
    let TestStrategy = isDev && requireLazy('passport-local').Strategy;

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
        callbackURL: '/auth/google/callback',
        passReqToCallback: true
      },
      function (request, accessToken, refreshToken, profile, done) {
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
          let id = new mongo.db.Types.ObjectId().toString();
          let profile = {
            provider: 'test',
            id: id,
            emails: [{ value: id + '@example.org' }],
            displayName: username
          };
          mongo.users.loginWith(profile, done);
        });
      })
    );

    let route = express.Router();
    route.use(passport.initialize());
    route.use(passport.session());
    console.log('passport initialized.');
    return route;
  }

  function router(options, isDev) {
    let route = express.Router();
    route.get(
      '/google',
      passport.authenticate('google', { scope: options.google.scope })
    );
    route.get(
      '/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      function (req, res) {
        console.log('user logged from google');
        console.log(inspect(req.user));
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
        console.log(inspect(req.user));
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
          console.log(inspect(_.pick(req.user, 'displayName', 'key')));
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
