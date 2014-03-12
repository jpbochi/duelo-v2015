/*global module*/
module.exports = function (grunt) {
  'use strict';

  var _ = require('lodash');
  var globals = _.reduce([
    'Kinetic', '$',
    'console', 'process',
    'require', 'define',
    'equal', 'notEqual', 'deepEqual', 'strictEqual', 'ok',
    'describe', 'it', 'beforeEach', 'afterEach',
    'sinon'
  ], function (acc, name) {
    acc[name] = true;
    return acc;
  }, {});

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        src: [ 'tests/server.js' ],
        options: {
          reporter: 'mocha-unfunk-reporter'
        }
      }
    },
    'mocha_phantomjs': {
      all: {
        options: {
          urls: ['http://localhost:3000/tests'],
          mocha: {
            ignoreLeaks: false
          },
          log: true,
          run: false,
          reporter: 'spec' //'mocha-unfunk-reporter',
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
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  /*global __dirname*/
  var requirejs = require('requirejs');
  requirejs('./tasks/config.js').register(grunt);
  requirejs('./tasks/console.js').register(grunt);
  requirejs('./tasks/server.js').register(grunt, __dirname);
  requirejs('./tasks/tests.js').register(grunt);

  grunt.registerTask('default', ['test', 'jshint']);
  grunt.registerTask('ci', ['test', 'jshint']);
};
