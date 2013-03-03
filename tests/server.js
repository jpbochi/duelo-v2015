var requirejs = require('requirejs');
var sinon = require('sinon-restore');
var fs = require('fs');

QUnit.testDone(sinon.restoreAll);

var pathToInclude = './tests/server/';
fs.readdirSync(pathToInclude)
  .filter(function (path) { return path.match(/.js$/); })
  .map(function (path) { return pathToInclude + path; })
  .forEach(requirejs);
