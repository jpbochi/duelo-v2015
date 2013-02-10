define(function (require) {
  // https://code.google.com/apis/console/
  var googleClient = {
    id: '468839478552-4et0rlhdi1v996m8elooqg20pjvauj2s.apps.googleusercontent.com',
    secret: 'RLVlgFBYE3BK31qZVx6GnJJ2',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  };
  // https://developers.facebook.com/apps/288952914564688
  var facebookClient = {
    id: '288952914564688',
    secret: 'f89cd8b59743f5ab4d9346e8492635d9',
    scope: [] // http://developers.facebook.com/docs/reference/login/#permissions
  };

  return { authClients: { google: googleClient, facebook: facebookClient } };
});
