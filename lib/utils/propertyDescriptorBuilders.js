'use strict';

// _hidden returns a property descriptor with default configuration for
// a protected property, which is also hidden (not enumerable).
// The value of the property needs to be passed in as `_hidden`'s single
// argument.
function _hidden(value){
  return {
    configurable: false,
    enumerable:   false,
    value:        value,
    writable:     false
  };
}

// _open returns a property descriptor with default configuration for
// an open property, which is not enumerable but can be altered.
// The value of the property needs to be passed in as `_open`'s single
// argument.
function _open(value){
  return {
    configurable: true,
    enumerable:   false,
    value:        value,
    writable:     true
  };
}

// _protected returns a property descriptor with default configuration for
// a protected property, that is, a property that should not be altered
// by outer entities. The value of the property needs to be passed in as
// `_protected`'s single argument.
function _protected(value){
  return {
    configurable: false,
    enumerable:   true,
    value:        value,
    writable:     false
  };
}

// _writable returns a property descriptor with default configuration for
// a hidden but writable property.
// The value of the property needs to be passed in as `_writable`'s
// single argument.
function _writable(value){
  return {
    configurable: false,
    enumerable:   false,
    value:        value,
    writable:     true
  };
}

module.exports = {
  _hidden: _hidden,
  _open: _open,
  _protected: _protected,
  _writable: _writable
};
