define(function (require) {
  /*global _*/
  'use strict';
  var requirejs = require;
  var assert = GLOBAL.assert || requirejs('chai').assert;

  function stringify(value) {
    if (value && _.isFunction(value.value)) { value = value.value(); }
    return JSON.stringify(value, null, 2);
  }

  function should(value, transform, description) {
    description = description || JSON.stringify(value);

    assert(
      transform(value),
      [
        description, ' was expected to ', transform.name,
        '\nActual: ', stringify(value)
      ].join('')
    );
  }

  function dateEqual(actual, expected) {
    assert.instanceOf(actual, Date);
    assert.equal(actual.toJSON(), new Date(expected).toJSON());
  }

  return {
    be: should,
    bePlainObject: function bePlainObject(value) { return _.isPlainObject(value); },
    dateEqual: dateEqual
  };
});
