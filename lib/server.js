define(function (require) {
  'use strict';
  var express = require('express');
  var http = require('http');
  var less = require('less-middleware');
  var path = require('path');
  var routes = require('./server/routes.js');
  var api = require('./server/api.js');
  var config = require('./server/config.js');
  var auth = require('./server/auth.js');
  var mongo = require('./server/mongo.js');

  var app = express();

  function throwIfError(err) {
    if (err) {
      throw err;
    }
  }

  function configure(dirname, done) {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({ secret: '45gbw6erfg732fgr3yvtb783' }));
    app.use(less({ src: path.join(dirname, '.') }));

    express.mime.define({ 'text/plain': [ 'ejs', 'ms' ] });

    app.use('/external', express.static(path.join(dirname, 'external')));
    app.use('/external', express.static(path.join(dirname, 'node_modules')));
    app.use('/css', express.static(path.join(dirname, 'css')));
    app.use('/views', express.static(path.join(dirname, 'views')));
    app.use('/tests', express.static(path.join(dirname, 'tests')));
    app.use('/', express.static(path.join(dirname, 'lib')));

    app.configure('development', function () {
      app.use(express.errorHandler());
    });

    mongo.connect(function (err) {
      throwIfError(err);
      console.log('mongo connected to ' + mongo.url());

      config.configure(app, function () {
        auth.configure(app);

        app.use(app.router);

        auth.register(app);
        routes.register(app);
        api.register(app);

        done && done();
      });
    });
  }

  function start(port, done) {
    port = port || app.get('port');
    http.createServer(app).listen(port, function () {
      console.log('Server express env is', app.get('env'));
      console.log('Server started at http://localhost:' + port);

      done && done();
    });
  }

  return { start: start, configure: configure };
});
