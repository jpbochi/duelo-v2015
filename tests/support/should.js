define(function (require) {
  /*global _*/
  'use strict';

  function stringify(value) {
    if (value && _.isFunction(value.value)) { value = value.value(); }
    return JSON.stringify(value, null, 2);
  }

  function should(value, transform, description) {
    description = description || JSON.stringify(value);

    ok(
      transform(value),
      [
        description, ' was expected to ', transform.name,
        '\nActual: ', stringify(value)
      ].join('')
    );
  }

  function dateEqual(actual, expected) {
    if (!actual || actual.constructor !== Date) {
      ok(false, ['"', actual, '" does not seems to be Date.'].join(''));
    } else {
      equal(actual.toJSON(), new Date(expected).toJSON());
    }
  }

  return {
    be: should,
    bePlainObject: function bePlainObject(value) { return _.isPlainObject(value); },
    dateEqual: dateEqual
  };
});
