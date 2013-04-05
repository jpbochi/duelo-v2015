define(function (require) {
  function throwIfError(err) {
    if (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    register: function (grunt) {
      grunt.registerTask('console', 'Start node CLI.', function (nodb) {
        var repl = require('repl');
        var config = require('../lib/server/config.js');
        var mongo = require('../lib/server/mongo.js');
        var done = this.async();

        global.grunt = grunt;
        global.requirejs = requirejs;
        global.config = config;
        global.mongo = mongo;
        global.lo = require('lodash');
        global.qunit = require('qunit');
        global.sinon = require('sinon-restore');

        Object.defineProperty(global, 'exit', {
          get: function () { done(true); return 'bye'; }
        });

        function startRepl() {
          repl.start({
            prompt: '> ',
            useGlobal: true
          }).on('exit', function () {
            done(true);
          });
        }

        if (nodb === 'nodb') {
          return startRepl();
        } else {
          mongo.connect(function (err) {
            throwIfError(err);
            console.log('mongo connected to ' + mongo.url());
            startRepl();
          });
        }
      });
    }
  };
});
