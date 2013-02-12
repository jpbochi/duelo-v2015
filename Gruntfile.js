module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: { all: { options: { urls: ['http://localhost:3333/tests/index.html'] } } },
    jshint: {
      all: [
        'lib/**/*.js',
        'tests/**/*.js',
        '*.js'
      ],
      options: {
        indent: 2,
        expr: true,
        bitwise: true,
        camelcase: true,
        curly: true,
        immed: true,
        noarg: true,
        nonew: true,
        plusplus: true,
        quotmark: 'single',
        trailing: true,
        maxparams: 4,
        maxlen: 150,
        browser: true,
        nomen: true,
        jquery: true,
        white: true,
        undef: true,
        globals: {
          'Kinetic': true,
          'KeyboardJS': true,
          '$': true,
          'console': true,
          'deepEqual': true,
          'equal': true,
          'ok': true,
          'start': true,
          'stop': true,
          'expect': true,
          'sinon': true,
          'module': true,
          'QUnit': true,
          'test': true,
          'process': true,
          'require': true,
          'define': true,
          'global': true,
          'Line': true,
          '$V': true,
          '_': true,
          '__dirname': true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('server', 'Start a custom web server.', function () {
    var requirejs = require('requirejs');
    var app = requirejs('./lib/server.js');
    var done = this.async();

    /*jshint nomen:false*/
    app.configure(__dirname, function () {
      app.start(3333, function () {
        done(true);
      });
    });
  });

  grunt.registerTask('console', 'Start node CLI.', function () {
    var repl = require('repl');
    require('./external/underscore/underscore-1.4.4.min.js');
    var requirejs = require('requirejs');
    var config = requirejs('./lib/server/config.js');

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

  grunt.registerTask('config:dump', 'Dumps the configuration.', function (configFile) {
    configFile = configFile || 'config_dump.json';

    var requirejs = require('requirejs');
    var config = requirejs('./lib/server/config.js');
    var fs = require('fs');

    var done = this.async();

    config.read(function (configValues) {
      console.log('Read config from', config.redisUrl, ', and merged to defaults.');
      console.log(configValues);

      var data = JSON.stringify(configValues);
      fs.writeFile(configFile, data, function (err) {
        if (err) { throw err; }

        console.log(configFile, 'saved.');
        done(true);
      });
    });
  });

  grunt.registerTask('config:upload', 'Uploads config json file to redis.', function (configFile) {
    configFile = configFile || 'config_dump.json';

    var requirejs = require('requirejs');
    var config = requirejs('./lib/server/config.js');
    var fs = require('fs');

    var done = this.async();

    fs.readFile(configFile, function (err, data) {
      if (err) { throw err; }

      var configValues = JSON.parse(data);
      config.save(configValues, function () {
        console.log([configFile, ' processed.'].join(''));
        done(true);
      });
    });
  });

  grunt.registerTask('test', ['server', 'qunit']);
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('ci', ['jshint', 'test']);
};
