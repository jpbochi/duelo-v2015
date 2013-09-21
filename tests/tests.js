define(function (require) {
  //require('/tests/mocha_setup.js');

  require('/tests/client.js');
  require('/tests/api.js');

  $.get('/auth/logout').always(function () {
    if (window.QUnit) {
      return window.QUnit.start();
    }
    if (window.mochaPhantomJS) {
      window.mochaPhantomJS.run();
    } else {
      window.mocha.run();
    }
  });
});
