define(function (require) {
  var support = require('/tests/support.js');
  var canvas = require('/client/renderer/canvas.js');

  describe('canvas', function () {
    beforeEach(support.kineticStubs.stage);

    afterEach(support.kineticStubs.restore);

    it.skip('init', function () {
      canvas(1, 2);

      ok(Kinetic.Stage.called);
      equal(Kinetic.Stage.callCount, 1);
      equal(Kinetic.Stage.lastCall.args[0].width, 1);
      equal(Kinetic.Stage.lastCall.args[0].height, 2);
      equal(Kinetic.Stage.lastCall.args[0].container, 'board');
    });
  });
});
