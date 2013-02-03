module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    qunit: { all: { options: { urls: ['http://localhost:19999/tests/index.html'] } } },
    connect: { server: { options: { port: 19999, base: '.' } } },
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
        maxparams: 2,
        maxlen: 150,
        browser: true,
        nomen: true,
        jquery: true,
        globals: {
          'Kinetic': true,
          'KeyboardJS': true,
          '$': true,
          'console': true,
          'deepEqual': true,
          'equal': true,
          'ok': true,
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
        },
        undef: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('test', ['connect', 'qunit']);
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('ci', ['jshint', 'test']);
};
