define(function (require) {
  var mongoose = require('mongoose');

  var userSchema = mongoose.Schema({
    key: { type: String, index: { unique: true } },
    provider: String,
    providerId: String,
    displayName: String,
    email: String,
    json: mongoose.Schema.Types.Mixed
  });

  var User = mongoose.model('user', userSchema);

  return {
    buildFromAuth: function (oauthUser) {
      /*jshint nomen:false*/
      var user = {
        key: [oauthUser.provider, ':', oauthUser.id].join(''),
        provider: oauthUser.provider,
        providerId: oauthUser.id,
        displayName: oauthUser.displayName,
        email: oauthUser.emails && oauthUser.emails[0],
        json: oauthUser._json
      };

      return new User(user);
    }
  };
});

