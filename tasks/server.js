define(function (require) {
  var app = require('../lib/server.js');

  return {
    register: function (grunt, dirname) {
      grunt.registerTask('server', 'Starts a web server listening on the specified port.', function (port) {
        var done = this.async();

        app.configure(dirname, function () {
          app.start(port);
        });
      });

      grunt.registerTask('test:server', 'Starts a web server to run tests.', function (port) {
        var done = this.async();

        app.configure(dirname, function () {
          app.start(port, function () {
            done(true);
          });
        });
      });
    }
  };
});
