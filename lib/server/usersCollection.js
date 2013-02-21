define(function (require) {
  var mongoose = require('mongoose');

  var userSchema = mongoose.Schema({
    key: { type: String, required: true, index: { unique: true } },
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    json: mongoose.Schema.Types.Mixed
  });

  var User = mongoose.model('user', userSchema);

  return {
    model: User,
    buildFromAuth: function (oauthUser) {
      /*jshint nomen:false*/
      var firstEmail = oauthUser.emails && oauthUser.emails[0].value;

      var user = {
        key: [oauthUser.provider, ':', oauthUser.id].join(''),
        provider: oauthUser.provider,
        providerId: oauthUser.id,
        displayName: oauthUser.displayName,
        email: firstEmail,
        json: oauthUser._json
      };

      return new User(user);
    }
  };
});

