define(function (require) {
  'use strict';
  var mongoose = require('mongoose');
  var hal = require('halberd');
  var _ = require('lodash');

  var userSchema = mongoose.Schema({
    key: { type: String, required: true, index: { unique: true } },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    lastLogin: Date,
    oauthJson: mongoose.Schema.Types.Mixed
  });

  userSchema.options.toJSON = {
    hidden: ['_id'],
    transform: function (doc, ret, options) {
      options.hidden && options.hidden.forEach(function (prop) {
        delete ret[prop];
      });
    }
  };

  userSchema.methods.selfHref = function () {
    return '/api/user/' + this.key;
  };

  userSchema.methods.toSessionData = function () {
    return new hal.Resource(_.omit(this.toJSON(), 'oauthJson'), this.selfHref());
  };

  var User = mongoose.model('user', userSchema);

  function keyFor(authProfile) {
    return [authProfile.provider, ':', authProfile.id].join('');
  }

  function buildFromAuth(authProfile) {
    /*jshint nomen:false*/
    var firstEmail = authProfile.emails && authProfile.emails[0].value;

    var user = {
      key: keyFor(authProfile),
      displayName: authProfile.displayName,
      email: firstEmail,
      oauthJson: authProfile._json
    };

    return new User(user);
  }

  return {
    model: User,
    loginWith: function (authProfile, done) {
      var key = keyFor(authProfile);

      this.model.findOne({ key: key }, function (err, existingUser) {
        if (err) { return done(err); }

        var user = existingUser || buildFromAuth(authProfile);
        user.lastLogin = Date.now();
        user.save(done);
      });
    }
  };
});

