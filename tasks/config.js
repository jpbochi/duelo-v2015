define(function (require) {
  var fs = require('fs');
  var config = require('../lib/server/config.js');

  return {
    register: function (grunt) {
      grunt.registerTask('config:dump', 'Dumps the configuration.', function (configFile) {
        configFile = configFile || 'config_dump.json';

        var done = this.async();

        config.read(function (configValues) {
          console.log('Read config from', config.redisUrl, ', and merged to defaults.');
          console.log(configValues);

          var data = JSON.stringify(configValues);
          fs.writeFile(configFile, data, function (err) {
            if (err) { throw err; }

            console.log(configFile, 'saved.');
            done(true);
          });
        });
      });

      grunt.registerTask('config:upload', 'Uploads config json file to redis.', function (configFile) {
        configFile = configFile || 'config_dump.json';

        var done = this.async();

        fs.readFile(configFile, function (err, data) {
          if (err) { throw err; }

          var configValues = JSON.parse(data);
          config.save(configValues, function () {
            console.log([configFile, ' processed.'].join(''));
            done(true);
          });
        });
      });
    }
  };
});
