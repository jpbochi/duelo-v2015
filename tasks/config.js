define(function (require) {
  var fs = require('fs');
  var config = require('../lib/server/config.js');
  var mongo = require('../lib/server/mongo.js');

  function throwIfError(err) {
    if (err) {
      console.error(err);
      throw err;
    }
  }

  return {
    register: function (grunt) {
      grunt.registerTask('config:dump', 'Dumps the configuration from mongo or defaults.', function (configFile) {
        configFile = configFile || 'config_dump.json';

        var done = this.async();

        console.log('Saving config to', configFile, '...');

        mongo.connect(function (err) {
          throwIfError(err);
          console.log('mongo connected to ' + mongo.url());

          config.read(function (err, configValues) {
            throwIfError(err);

            console.log(configValues);

            var data = JSON.stringify(configValues);
            fs.writeFile(configFile, data, function (err) {
              throwIfError(err);

              console.log(configFile, 'saved.');
              done(true);
            });
          });
        });
      });

      grunt.registerTask('config:update', 'Updates config json file to mongo.', function (configFile) {
        configFile = configFile || 'config_dump.json';

        var done = this.async();

        mongo.connect(function (err) {
          throwIfError(err);
          console.log('mongo connected to ' + mongo.url());

          fs.readFile(configFile, function (err, data) {
            throwIfError(err);

            var configValues = JSON.parse(data);
            console.log(configValues);

            config.update(configValues, function (err) {
              throwIfError(err);

              console.log([configFile, ' processed.'].join(''));
              done(true);
            });
          });
        });
      });
    }
  };
});
