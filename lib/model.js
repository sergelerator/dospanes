'use strict';

var Attribute = require('./attribute');

// baseModelClass works as the prototype of any Model class, any public
// properties that should be available to any model class are to be added
// here.
var baseModelClass = Object.create({}, {
      build: _hidden(build)
    }),

// baseModelInstance works as the prototype of any Model instance, any
// public properties that should be available to any model instance are to
// be added here.
    baseModelInstance = Object.create({}, {
      isDirty:  _hidden(isDirty),
      save:     _hidden(save)
    });

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

// _defaultGetter receives the attributes object and the attribute name,
// this works as a general purpose getter method to which we can add hooks
// or something.
function _defaultGetter(attributes, attributeName){
  return function(){
    return attributes[attributeName];
  };
}

// _defaultSetter receives the attributes object and the attribute name,
// this works as a general purpose setter method to which we can add hooks
// or something. By default, this is used to set the `isDirty` flag to true
// when there are changes to the model's attributes.
function _defaultSetter(attributes, attributeName){
  return function(value){
    attributes.__isDirty__ = true;
    attributes[attributeName] = value;
  };
}

// *model class*

function extendModelInstanceAttributes(attributes){
  Object.defineProperty(attributes, '__isDirty__', {
    configurable: false,
    enumerable:   false,
    value:        false,
    writable:     true
  });
}

// The build function creates an instance of a model with the provided
// attributes.
function build(attributes){
  var instance,
      propertiesDescriptor = {};

  if (typeof attributes !== 'object') {
    attributes = {};
  }

  for (var attributeName in this.attributesPrototype) {
    var attribute = this.attributesPrototype[attributeName],
        propertyDesc;


    if (attribute.getter){
      propertyDesc = {
        configurable: false,
        enumerable: true,
        get: attribute.getter.bind(attributes)
      };
    } else {
      if (attributes[attributeName] === undefined) {
        attributes[attributeName] = attribute.defaultValue;
      }

      propertyDesc = {
        configurable: false,
        enumerable: true,
        get: _defaultGetter(attributes, attributeName),
        set: _defaultSetter(attributes, attributeName)
      };
    }

    propertiesDescriptor[attributeName] = propertyDesc;
  }

  extendModelInstanceAttributes(attributes);
  propertiesDescriptor['attributes'] = _hidden(attributes);

  instance = Object.create(baseModelInstance, propertiesDescriptor);
  this.store.push(instance);
  return instance;
}

// *model instance*

// isDirty returns a boolean value depending on whether the model instance
// attributes have been changed or not. Dirty model instances can be used to
// determine if such an instance should be saved.
function isDirty(){
  return this.attributes.__isDirty__;
}

// TODO save should attempt to persist the current state of the attributes's
// enumerable properties to some persistence layer.
function save(){
  return (new Promise(function(resolve, reject){
    this.attributes.__isDirty__ = false;
    resolve(this.attributes);
  }.bind(this)));
}

// Model creates a model class, this is the exposed constructor of the module.
// It accepts a `modelName` as a parameter and the modelDescription object.
// So far, the modelDescription should contain an `attributes` property, which
// contains an object describing the model's attributes. i.e.
//
//  Model('User', {
//    attributes: {
//      firstName:  Attribute.text,
//      lastName:   Attribute.text,
//      coins:      Attribute.number,
//
//      fullName: Attribute.computed(function(){
//        return this.firstName + ' ' + this.lastName;
//      })
//    }
//  })
//
function Model(modelName, modelDescription){
  if (!modelName.toString || typeof modelName.toString !== 'function') {
    throw new TypeError('modelName should be a string or have a .toString method!');
  }
  modelName = modelName.toString();

  if (!Model[modelName]){
    Model[modelName] = Object.create(baseModelClass, {
      name: _protected(modelName),
      attributesPrototype: _protected(modelDescription.attributes || {}),
      store: _protected([])
    });
  }
  return Model[modelName];
}

module.exports = Model;
