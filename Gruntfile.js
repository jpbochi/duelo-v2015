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
        maxparams: 3,
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
          'require': true,
          'define': true,
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
    app.configure(__dirname);
    app.start(3333, function () {
      done(true);
    });
  });

  grunt.registerTask('console', 'Start node CLI.', function () {
    var repl = require('repl');
    global.requirejs = require('requirejs');

    var done = this.async();

    repl.start({
      prompt: '> ',
      useGlobal: true
    }).on('exit', function () {
      done(true);
    });
  });

  grunt.registerTask('test', ['server', 'qunit']);
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('ci', ['jshint', 'test']);
};
