define(function (require) {
  'use strict';
  function create(width, height) {
    //KineticJS is dead! Find something else
    /*
    var stage;
    var foreground = new Kinetic.Layer();
    var background = new Kinetic.Layer();

    function draw(state) {
      updateScale(state.currentScene.width, state.currentScene.height);
      updateLayers(state.currentScene.layers.background, state.currentScene.layers.foreground);

      stage.draw();
    }

    function updateScale(width, height) {
      stage.setScale(stage.getWidth() / width, stage.getHeight() / height);
    }

    function updateLayers(newBackground, newForeground) {
      if (newForeground !== foreground || (newBackground || background) !== background) {
        stage.removeChildren();

        foreground = newForeground;
        background = newBackground || background;

        stage.add(background);
        stage.add(foreground);
      }
    }

    stage = new Kinetic.Stage({ container: 'board', width: width, height: height });
    */

    return { callbacks: { draw: function () {} } };
  }

  return create;
});
