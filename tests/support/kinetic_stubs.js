define(function (require) {
  function restore() {
    Kinetic.Stage.restore();
  }

  function stage() {
    var fake = {
      getWidth: sinon.stub(),
      getHeight: sinon.stub(),
      setWidth: sinon.spy(),
      setHeight: sinon.spy(),
      setScale: sinon.spy(),
      draw: sinon.spy(),
      add: sinon.spy(),
      removeChildren: sinon.spy()
    };
    fake.getWidth.returns(10);
    fake.getHeight.returns(10);
    sinon.stub(Kinetic, 'Stage').returns(fake);
  }

  return {
    stage: stage,
    restore: restore
  };
});
