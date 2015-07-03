'use strict';

var Attribute = (function(){
  var base = {
    type: null,
    validator: function(){ return true; }
  };

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

Attribute.text = Attribute({ type: 'text' });
Attribute.number = Attribute({ type: 'number' });

Attribute.computed = function(fn){
  return Attribute({
    type: 'computed',
    getter: fn,
    setter: function(){}
  });
};

module.exports = Attribute;
