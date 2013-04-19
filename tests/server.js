(function () {
  'use strict';
  /*global GLOBAL*/

  var fs = require('fs');
  var requirejs = require('requirejs');
  var sinon = require('sinon-restore');
  var support = requirejs('tests/support/server.js');
  GLOBAL._ = require('lodash');

  QUnit.testStart(function () {
    QUnit.stop();
    support.clearDb(QUnit.start);
  });

  QUnit.testDone(sinon.restoreAll);

  QUnit.config.testTimeout = 1000;

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
