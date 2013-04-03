define(function (require) {
  /*global _*/
  'use strict';

  function stringify(value) {
    if (_.isFunction(value.value)) { value = value.value(); }
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

  return {
    be: should,
    bePlainObject: function bePlainObject(value) { return _.isPlainObject(value); }
  };
});
