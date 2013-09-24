(function () {
  'use strict';
  /*global GLOBAL,before,beforeEach,afterEach,after*/

  var fs = require('fs');
  var requirejs = require('requirejs');
  var sinon = require('sinon-restore');
  var support = requirejs('tests/support/server.js');
  GLOBAL._ = require('lodash');

  var expect = require('chai').expect;
  GLOBAL.stop = function () {};
  GLOBAL.strictEqual = function (actual, expected, message) {
    expect(actual).to.equal(expected, message);
  };
  GLOBAL.equal = function (actual, expected, message) {
    expect(actual).to.eql(expected, message);
  };
  GLOBAL.notEqual = function (actual, expected, message) {
    expect(actual).not.to.eql(expected, message);
  };
  GLOBAL.deepEqual = GLOBAL.equal;
  GLOBAL.test = GLOBAL.it;
  GLOBAL.QUnit = {
    config: { current: { assertions: [] } },
    module: function () {}// GLOBAL.suite
  };
  GLOBAL.module = GLOBAL.QUnit.suite;

  before(support.ensureMongoConnected);
  beforeEach(support.clearDb);//mocha.run.bind(null, function() {}));
  afterEach(sinon.restoreAll);
  after(support.disconnectMongo);

  (function requireRecursively(initialPath) {
    fs.readdirSync(initialPath)
      .map(function (path) { return initialPath + path; })
      .forEach(function (path) {
        if (fs.statSync(path).isDirectory()) {
          requireRecursively(path + '/');
        } else
        if (path.match(/.js$/)) {
          console.log(path);
          requirejs(path);
        }
      });
  })('./tests/server/');
})();
