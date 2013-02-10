define(function (require) {
  /*global process*/

  var express = require('express');
  var http = require('http');
  var less = require('less-middleware');
  var path = require('path');
  var routes = require('./server/routes.js');
  var auth = require('./server/auth.js');

  var app = express();
  
  function configure(dirname) {
    app.configure(function () {
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

      auth.configure(app);

      app.use(app.router);
      app.use(express['static'](path.join(dirname, '.')));
    });

    app.configure('development', function () {
      app.use(express.errorHandler());
    });

    auth.register(app);
    routes.register(app);
  }

  function start(port, callback) {
    port = port || app.get('port');
    http.createServer(app).listen(port, function () {
      console.log('server listening on port ' + port);
      callback && callback();
    });
  }

  return { start: start, configure: configure };
});
