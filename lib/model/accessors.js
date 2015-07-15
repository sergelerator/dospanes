'use strict';

// defaultGetter receives the attribute name.
// this works as a general purpose getter method to which we can add hooks
// or something.
function defaultGetter(attributeName){
  return function(){
    return this.attributes[attributeName];
  };
}

// defaultSetter receives the attribute name.
// this works as a general purpose setter method to which we can add hooks
// or something. By default, this is used to set the `isDirty` flag to true
// when there are changes to the model's attributes.
function defaultSetter(attributeName){
  return function(value){
    this.__isDirty__ = true;
    this.attributes[attributeName] = value;
  };
}

module.exports = {
  _defaultGetter: defaultGetter,
  _defaultSetter: defaultSetter,
};
