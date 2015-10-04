(function () {
  'use strict';
  var requirejs = require('requirejs');
  var app = requirejs('./lib/server');

  process.on('SIGINT', function() {
    console.log('Stopping server...');
    app.stop(() => process.exit(1));
  });

  /*jshint nomen:false*/
  /*global __dirname*/
  app.configure(__dirname, app.start);
})();
