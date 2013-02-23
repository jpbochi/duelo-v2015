define(function (require) {
  var mongoose = require('mongoose');

  var userSchema = mongoose.Schema({
    key: { type: String, required: true, index: { unique: true } },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    lastLogin: Date,
    oauthJson: mongoose.Schema.Types.Mixed
  });

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

        if (existingUser) { return done(null, existingUser); }

        buildFromAuth(authProfile).save(done);
      });
    }
  };
});

