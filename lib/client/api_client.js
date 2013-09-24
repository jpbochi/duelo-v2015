define(function (require) {
  'use strict';
  var _ = require('/external/lodash/dist/lodash.js');
  var hal = require('/external/halberd/hal.js');

  var knownMimes = [
    {
      type: (/^application\/[a-z+\-]*hal\+json$/),
      parse: function (data) {
        return new hal.Resource(data);
      }
    }
  ];

  function translate(data, jqXHR) {
    var type = jqXHR.getResponseHeader('Content-Type');
    var mime = _(knownMimes).filter(function (mime) {
      return mime.type.test(type);
    }).first();

    return mime ? mime.parse(data) : data;
  }

  return {
    get: function (url) {
      return $.get(url).then(function (data, textStatus, jqXHR) {
        return translate(data, jqXHR);
      });
    },
    post: function (url, data) {
      return $.post(url, data).then(function (data, textStatus, jqXHR) {
        var location = jqXHR.getResponseHeader('Location');

        if (location) {
          return hal.Link('location', location);
        }

        return { jqXHR: jqXHR, data: data };
      });
    },
    extendHal: function () {
      var api = this;

      hal.Link.prototype.get = function () {
        return api.get(this.href);
      };
      hal.Link.prototype.post = function (data) {
        return api.post(this.href, data);
      };

      return api;
    }
  };
});
