define(function (require) {
  var support = require('/tests/support.js');
  var canvas = require('/client/renderer/canvas.js');

  describe('canvas', function () {
    beforeEach(support.kineticStubs.stage);

    afterEach(support.kineticStubs.restore);

    it.skip('init', function () {
      canvas(1, 2);

      assert(Kinetic.Stage.called);
      assert.equal(Kinetic.Stage.callCount, 1);
      assert.equal(Kinetic.Stage.lastCall.args[0].width, 1);
      assert.equal(Kinetic.Stage.lastCall.args[0].height, 2);
      assert.equal(Kinetic.Stage.lastCall.args[0].container, 'board');
    });
  });
});
