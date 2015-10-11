define(function (require) {
  'use strict';
  let mongoose = require('mongoose');
  let _ = require('lodash');
  let view = require('lib/server/users_view.js');

  let userSchema = mongoose.Schema({
    key: { type: String, required: true, index: { unique: true } },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    lastLogin: Date,
    oauthJson: mongoose.Schema.Types.Mixed
  });

  userSchema.options = _.defaults(userSchema.options, view.options);
  userSchema.methods = _.defaults(userSchema.methods, view.methods);

  let User = mongoose.model('user', userSchema);

  function keyFor(authProfile) {
    return [authProfile.provider, ':', authProfile.id].join('');
  }

  function buildFromAuth(authProfile) {
    /*jshint nomen:false*/
    let firstEmail = authProfile.emails && authProfile.emails[0].value;

    let user = {
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
      let key = keyFor(authProfile);

      this.model.findOne({ key: key }, function (err, existingUser) {
        if (err) { return done(err); }

        let user = existingUser || buildFromAuth(authProfile);
        user.lastLogin = Date.now();
        user.save(done);
      });
    }
  };
});
