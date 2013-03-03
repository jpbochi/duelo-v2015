var fs = require('fs');
var requirejs = require('requirejs');
var sinon = require('sinon-restore');
var support = requirejs('tests/support/server.js');

QUnit.testStart(function () {
  QUnit.stop();
  support.clearDb(QUnit.start);
});
QUnit.testDone(sinon.restoreAll);

var pathToInclude = './tests/server/';
fs.readdirSync(pathToInclude)
  .filter(function (path) { return path.match(/.js$/); })
  .map(function (path) { return pathToInclude + path; })
  .forEach(requirejs);
