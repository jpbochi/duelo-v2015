define(function (require) {
  require('/tests/mocha_setup.js');

  //require('/tests/client.js');
  require('/tests/api.js');

  $.get('/auth/logout').always(function () {
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
  });
});
