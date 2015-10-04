define(function () {
  'use strict';

  return {
    handleErr: function (err, res) {
      if (err) {
        console.log(err, JSON.stringify(err));
        res.status(500).send(err);
      }
    }
  };
});
