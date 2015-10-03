define(function (require) {
  'use strict';
  var express = require('express');
  var http = require('http');
  var less = require('less-middleware');
  var path = require('path');
  var _ = require('lodash');

  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');
  var cookieSession = require('cookie-session');
  var errorHandler = require('errorhandler');

  var config = require('./server/config.js');
  var mongo = require('./server/mongo.js');
  var auth = require('./server/auth.js');
  var rootRoutes = require('./server/routes.js');
  var api = require('./server/api.js');
  var testRoutes = require('./server/test_routes.js');

  var app = express();

  function throwIfError(err) {
    if (err) {
      throw err;
    }
  }

  function configure(dirname, done) {
    var development = ('development' === app.get('env'));
    var sessionSecret = process.env.SESSION_SECRET || 'not-really-secret';

    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(dirname, 'content/views'));
    app.set('view engine', 'ejs');

    app.use(favicon(path.join(dirname, 'content/favicon.ico')));
    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false })); // parse requests with application/x-www-form-urlencoded
    app.use(methodOverride());
    app.use(cookieSession({
      secret: sessionSecret,
      cookie: { maxAge: 24 * 60 * 60 * 1000 }
    }));
    development && app.use(errorHandler());

    app.use(less(path.join(dirname, '.')));

    app.use('/external', express['static'](path.join(dirname, 'bower_components')));
    app.use('/external', express['static'](path.join(dirname, 'node_modules')));
    app.use('/content', express['static'](path.join(dirname, 'content')));
    app.use('/tests', express['static'](path.join(dirname, 'tests')));
    app.use('/', express['static'](path.join(dirname, 'lib')));

    mongo.connect(function (err) {
      throwIfError(err);
      console.log('mongo connected to ' + mongo.url());

      config.configure(app, function () {
        app.use(auth.middleware(app.get('auth'), development));
        app.use('/auth', auth.router(app.get('auth'), development));

        app.use('/', rootRoutes.router());
        app.use('/api', api.router());
        development && app.use('/api-test', testRoutes.router());

        done && done();
      });
    });
  }

  let runningServer = null;
  function start(port, done) {
    port = port || app.get('port');
    runningServer = http.createServer(app);
    runningServer.listen(port, function () {
      console.log('Server express env is', app.get('env'));
      console.log('Server started at http://127.0.0.1:' + port);

      done && done();
    });
  }

  function stop(done) {
    let server = runningServer;
    runningServer = null;
    if (server) {
      server.close(done);
      server.unref();
    } else {
      done && done();
    }
  }

  return {
    start: start,
    configure: configure,
    stop: stop
  };
});
