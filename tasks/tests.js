define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('test:set_env', 'Sets environment variables to test.', function () {
        process.env.MONGOHQ_URL = 'mongodb://mongodb/duelo_test';

        grunt.config.set('mocha_phantomjs.all.options.urls', ['http://localhost:3333/tests']);
      });

      grunt.registerTask(
        'test:backend',
        'Run all server-side tests.',
        ['test:set_env', 'mochaTest']
      );
      grunt.registerTask(
        'test:client',
        'Run all client-side tests.',
        ['test:set_env', 'server:test:3333', 'mocha_phantomjs']
      );
      grunt.registerTask(
        'test',
        'Run all tests.',
        ['test:backend', 'test:client']
      );
    }
  };
});
