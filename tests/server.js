var requirejs = require('requirejs');
var sinon = require('sinon-restore');

QUnit.testDone(sinon.restoreAll);

requirejs('./tests/server/usersCollection_tests.js');
