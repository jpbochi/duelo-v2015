module.exports = function (grunt) {
  'use strict';
  /*global global*/

  var _ = require('lodash');

  var globals = _.reduce([
    'Kinetic',
    '$',
    'console', 'process',
    'require', 'define',
    'equal', 'notEqual', 'deepEqual', 'strictEqual', 'ok',
    'start', 'stop',
    'module', 'QUnit', 'test', 'sinon'
  ], function (acc, name) {
    acc[name] = true;
    return acc;
  }, {});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: { all: { options: { urls: ['http://localhost:3333/tests'] } } },
    mochaTest: {
      test: {
        src: [ 'tests/server.js' ],
        options: {
          reporter: 'mocha-unfunk-reporter'
        }
      }
    },
    mocha: {
      all: {
        options: {
          urls: ['http://localhost:3000/tests'],
          mocha: {
            ignoreLeaks: false
          },
          reporter: 'mocha-unfunk-reporter',
          log: true,
          run: false
        }
      }
    },
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
        nomen: false,
        jquery: true,
        white: true,
        undef: true,
        globals: globals
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');

  /*global __dirname*/
  var requirejs = require('requirejs');
  requirejs('./tasks/config.js').register(grunt);
  requirejs('./tasks/console.js').register(grunt);
  requirejs('./tasks/server.js').register(grunt, __dirname);
  requirejs('./tasks/tests.js').register(grunt);

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('ci', ['jshint', 'test']);
};
