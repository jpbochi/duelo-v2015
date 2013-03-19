define(function (require) {
  'use strict';
  var _ = require('lodash');
  var mongoose = require('mongoose');
  var mongo = require('./mongo.js');

  var configSchema = mongoose.Schema({
    auth: mongoose.Schema.Types.Mixed
  });

  var configModel = mongoose.model('config', configSchema);

  var defaults = {
    auth: {
      // https://code.google.com/apis/console/
      google: {
        id: '468839478552-4et0rlhdi1v996m8elooqg20pjvauj2s.apps.googleusercontent.com',
        secret: 'RLVlgFBYE3BK31qZVx6GnJJ2',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      },
      // https://developers.facebook.com/apps/288952914564688
      facebook: {
        id: '288952914564688',
        secret: 'f89cd8b59743f5ab4d9346e8492635d9',
        scope: [ 'email' ] // http://developers.facebook.com/docs/reference/login/#permissions
      }
    }
  };

  return {
    model: configModel,
    configure: function (app, done) {
      this.read(function (err, config) {
        if (err) { throw err; }

        app.set('auth', config.auth);
        done();
      });
    },
    read: function (done) {
      if (!mongo.isConnected()) {
        return done('Not connected to mongo.');
      }

      configModel.findOne({}, function (err, values) {
        if (err) { return done(err); }

        var config = _.defaults(values || {}, defaults);
        done(null, config);
      });
    },
    update: function (configValues, done) {
      if (!mongo.isConnected()) {
        return done('Not connected to mongo.');
      }

      configModel.findOneAndUpdate(
        { '_id': { $exists: true } },
        configValues,
        { upsert: true },
        done
      );
    }
  };
});
