define(function (require) {
  require('/tests/mocha_setup.js');

  //require('/external/mocha-unfunk-reporter/build/unfunk.js');
  /*jshint maxlen:255*/
/*
phantomjs C:\\Users\\jp\\AppData\\Roaming\\npm\\node_modules\\mocha-phantomjs\\lib\\mocha-phantomjs.coffee http://localhost:3000/tests spec '{"timeout":6000,"cookies":[],"headers":{},"settings":{},"useColors":true}'
phantomjs node_modules/grunt-mocha-phantomjs/node_modules/mocha-phantomjs/lib/mocha-phantomjs.coffee http://localhost:3000/tests spec '{"timeout":6000,"cookies":[],"headers":{},"settings":{},"useColors":true}'
*/

  require('/tests/client.js');
  require('/tests/api.js');

  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    window.mocha.run();
  }
});
