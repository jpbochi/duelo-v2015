define(function (require) {
  var support = require('tests/support');
  var canvas = require('lib/client/renderer/canvas');

  module('canvas', {
    setup: support.kineticStubs.stage,
    teardown: support.kineticStubs.restore
  });

  test('init', function () {
    canvas(1, 2);

    ok(Kinetic.Stage.called);
    equal(Kinetic.Stage.callCount, 1);
    equal(Kinetic.Stage.lastCall.args[0].width, 1);
    equal(Kinetic.Stage.lastCall.args[0].height, 2);
    equal(Kinetic.Stage.lastCall.args[0].container, 'board');
  });
});
