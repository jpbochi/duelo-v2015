define(function (require) {
  var mongoose = require('mongoose');

  var userSchema = mongoose.Schema({
    key: { type: String, index: { unique: true } },
    provider: String,
    providerid: String,
    displayName: String,
    email: String,
    json: mongoose.Schema.Types.Mixed
  });

  var User = mongoose.model('user', userSchema);

  return {
    build: function (values) {
      return new User(values);
    }
  };
});

