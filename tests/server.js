(function () {
  'use strict';
  /*global GLOBAL,before,beforeEach,afterEach,after*/

  var fs = require('fs');
  var requirejs = require('requirejs');
  var sinon = require('sinon-restore');
  var support = requirejs('tests/support/server.js');
  GLOBAL._ = require('lodash');

  require('chai').config.includeStack = true;

  describe('server-side tests', function () {
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
          } else if (path.match(/.js$/)) {
            console.log(path);
            requirejs(path);
          }
        });
    })('./tests/server/');
  });
})();
