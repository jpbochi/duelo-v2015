define(function () {
  'use strict';

  return {
    handleErr: function (err, res) {
      if (err) {
        console.log(err, JSON.stringify(err));
        res.send(500, err);
      }
    }
  };
});
