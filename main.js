(function () {
  'use strict';
  var requirejs = require('requirejs');
  var app = requirejs('./lib/server');

  /*jshint nomen:false*/
  /*global __dirname*/
  app.configure(__dirname, app.start);
})();
