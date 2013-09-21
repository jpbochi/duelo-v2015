define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('test:set_env', 'Sets environment variables to test.', function () {
        process.env.MONGOHQ_URL = 'mongodb://localhost/duelo_test';
      });

      grunt.registerTask(
        'test:backend',
        'Run all server-side tests.',
        ['test:set_env', 'mochaTest']
      );
      grunt.registerTask(
        'test:client',
        'Run all client-side tests.',
        ['test:set_env', 'server:test:3333', 'qunit']
      );
      grunt.registerTask(
        'test',
        'Run all tests.',
        ['test:backend', 'test:client']
      );
    }
  };
});
