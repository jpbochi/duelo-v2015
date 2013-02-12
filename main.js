(function () {
  var requirejs = require('requirejs');
  var app = requirejs('./lib/server');

  /*jshint nomen:false*/
  app.configure(__dirname, app.start);
})();
