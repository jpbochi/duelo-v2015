define(function (require) {
  /*global process*/

  var express = require('express'),
      http = require('http'),
      routes = require('./server/routes'),
      less = require('less-middleware'),
      path = require('path');

  var app = express();

  routes.register(app);
  
  function configure(dirname) {
    app.configure(function () {
      app.set('port', process.env.PORT || 3000);
      app.set('views', path.join(dirname, 'views'));
      app.set('view engine', 'ejs');
      app.use(express.favicon());
      app.use(express.logger('dev'));
      app.use(express.bodyParser());
      app.use(express.methodOverride());
      app.use(app.router);
      app.use(less({ src: path.join(dirname, '.') }));
      app.use(express['static'](path.join(dirname, '.')));
    });

    app.configure('development', function () {
      app.use(express.errorHandler());
    });
  }

  function start() {
    http.createServer(app).listen(app.get('port'), function () {
      console.log('server listening on port ' + app.get('port'));
    });
  }

  return { start: start, configure: configure };
});
