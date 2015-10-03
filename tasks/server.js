define(function (require) {
  var app = require('../lib/server.js');

  return {
    register(grunt, dirname) {
      grunt.registerTask('server', 'Starts a web server listening on the specified port.', function (port) {
        var done = this.async();

        app.configure(dirname, function () {
          app.start(port, function () {
            done(true);
          });
        });
      });

      grunt.registerTask('server:test', 'Starts a web server to run tests.', function (port) {
        var done = this.async();
        port = port || 3030;

        app.configure(dirname, function () {
          app.start(port, function () {
            done(true);
          });
        });
      });
    }
  };
});
