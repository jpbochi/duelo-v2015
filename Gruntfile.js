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
          '_': true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  /*jshint nomen:false*/
  /*global __dirname*/
  var requirejs = require('requirejs');
  requirejs('./tasks/config.js').register(grunt);
  requirejs('./tasks/console.js').register(grunt);
  requirejs('./tasks/server.js').register(grunt, __dirname);

  grunt.registerTask('test', ['test_server:3333', 'qunit']);
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('ci', ['jshint', 'test']);
};
