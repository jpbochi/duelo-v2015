define(function () {
  'use strict';
  var base = 26;
  var zero = 'a'.charCodeAt(0);
  var largerDigit = zero + base - 1;

  var convert = function convert(value) {
    if (value < 0) { throw 'value must be non-negative'; }

    var rem = value % base;
    var digit = String.fromCharCode(zero + rem);
    var div = Math.floor(value / base);

    return (div === 0) ? digit : (convert(div - 1) + digit);
  };

  var parse = function (input) {
    if (!/^[a-z]+$/.test(input)) { throw 'value must look like /^[a-z]+$/'; }

    return input.split('').map(function (digit) {
      return digit.charCodeAt(0) - zero;
    }).reduce(function (total, digitValue) {
      return ((total + 1) * base) + digitValue;
    }, -1);
  };

  return {
    convert: convert,
    parse: parse
  };
});
