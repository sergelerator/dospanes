'use strict';

// Attribute is used to create attribute types
var Attribute = (function(){
  var base = {
    type: null,
    validator: function(){ return true; }
  };

  // The Attribute constructor receives a config object describing how the
  // attribute should behave.
  function Attribute(attribute) {
    var propertiesDescriptor = {};

    for (var propName in attribute) {
      propertiesDescriptor[propName] = {
        configurable: false,
        value:        attribute[propName],
        writable:     false
      };
    }

    return Object.create(base, propertiesDescriptor);
  }
  return Attribute;
})();

// Default attribute types

Attribute.text = Attribute({ type: 'text', defaultValue: '' });
Attribute.number = Attribute({ type: 'number', defaultValue: 0 });

// The computed attribute expects a function which will be used as the
// attribute getter in the model. This function will always be executed
// in the context of a model's `attributes` object.
Attribute.computed = function(fn){
  return Attribute({
    type: 'computed',
    getter: fn,
    setter: function(){}
  });
};

module.exports = Attribute;
