define(function (require) {
  'use strict';
  var express = require('express');

  function router() {
    var route = express.Router();
    route.get('/', function (req, res) {
      if (!req.user) {
        res.render('login');
      } else {
        res.render('index', { user: req.user });
      }
    });

    route.get('/tests', function (req, res) { res.redirect('/tests/index.html'); });
    return route;
  }

  return { router: router };
});
