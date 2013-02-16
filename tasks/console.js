define(function (require) {
  return {
    register: function (grunt) {
      grunt.registerTask('console', 'Start node CLI.', function () {
        var repl = require('repl');
        require('../external/underscore/underscore-1.4.4.min.js');
        var config = require('../lib/server/config.js');

        var done = this.async();

        config.redis.on('connect', function () {
          console.log('Connected to', config.redisUrl, '.');

          global.requirejs = requirejs;
          global.config = config;
          global.redis = config.redis;

          repl.start({
            prompt: '> ',
            useGlobal: true
          }).on('exit', function () {
            done(true);
          });
        });
      });
    }
  };
});
