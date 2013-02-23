define(function (require) {
  var mongoose = require('mongoose');

  var userSchema = mongoose.Schema({
    key: { type: String, required: true, index: { unique: true } },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    oauthJson: mongoose.Schema.Types.Mixed
  });

  var User = mongoose.model('user', userSchema);

  return {
    model: User,
    buildFromAuth: function (oauthUser) {
      /*jshint nomen:false*/
      var firstEmail = oauthUser.emails && oauthUser.emails[0].value;

      var user = {
        key: [oauthUser.provider, ':', oauthUser.id].join(''),
        displayName: oauthUser.displayName,
        email: firstEmail,
        oauthJson: oauthUser._json
      };

      return new User(user);
    },
    loginWith: function (oauthUser, done) {
      var user = this.buildFromAuth(oauthUser);

      user.save(done);
    }
  };
});

