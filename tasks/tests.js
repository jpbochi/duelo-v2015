define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('test:node', 'Runs node-side tests.', function (port) {
        var testrunner = require('qunit');

        testrunner.setup({
          log: {
            tests: true,
            errors: true,
            globalSummary: true
          }
        });

        var done = this.async();

        testrunner.run({
          code: '/dev/null',
          tests: 'tests/server.js'
        }, function (err, report) {
          if (err) { throw err; }
          //console.dir(report);
          done(report && report.failed === 0);
        });
      });

      grunt.registerTask('test', ['test_server:3333', 'qunit', 'test:node']);
    }
  };
});
