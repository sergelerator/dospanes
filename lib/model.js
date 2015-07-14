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

// _defaultGetter receives the attribute name.
// this works as a general purpose getter method to which we can add hooks
// or something.
function _defaultGetter(attributeName){
  return function(){
    return this.attributes[attributeName];
  };
}

// _defaultSetter receives the attribute name.
// this works as a general purpose setter method to which we can add hooks
// or something. By default, this is used to set the `isDirty` flag to true
// when there are changes to the model's attributes.
function _defaultSetter(attributeName){
  return function(value){
    this.__isDirty__ = true;
    this.attributes[attributeName] = value;
  };
}

// *model class*

// The build function creates an instance of a model with the provided
// attributes.
function build(attributes){
  var instance = Object.create(this.baseInstance, {
    attributes: _hidden({}),
  });

  if (typeof attributes !== 'object') {
    attributes = {};
  }

  for (var attributeName in this.attributesPrototype) {
    var attributeDescriptor = this.attributesPrototype[attributeName];

    if (!attributeDescriptor.getter) {
      if (attributes.hasOwnProperty(attributeName)) {
        instance.attributes[attributeName] = attributes[attributeName];
      } else {
        instance.attributes[attributeName] = attributeDescriptor.defaultValue;
      }
    }
  }

  this.store.push(instance);
  return instance;
}

// *model instance*

// isDirty returns a boolean value depending on whether the model instance
// attributes have been changed or not. Dirty model instances can be used to
// determine if such an instance should be saved.
function isDirty(){
  return this.__isDirty__;
}

// TODO save should attempt to persist the current state of the attributes's
// enumerable properties to some persistence layer.
function save(){
  return (new Promise(function(resolve, reject){
    this.__isDirty__ = false;
    resolve(this.attributes);
  }.bind(this)));
}

function createBaseModelInstance(attributesPrototype){
  var baseInstance = Object.create(baseModelInstance, {
    __isDirty__: {
      configurable: false,
      enumerable:   false,
      value:        false,
      writable:     true
    }
  });

  for (var attributeName in attributesPrototype) {
    var attribute = attributesPrototype[attributeName],
        propertyDesc;

    if (attribute.getter){
      Object.defineProperty(baseInstance, attributeName, {
        configurable: false,
        enumerable: true,
        get: attribute.getter
      });
    } else {
      Object.defineProperty(baseInstance, attributeName, {
        configurable: false,
        enumerable: true,
        get: _defaultGetter(attributeName),
        set: _defaultSetter(attributeName)
      });
    }
  }

  return baseInstance;
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
  var attributesPrototype;

  if (modelName === undefined || typeof modelName.toString !== 'function') {
    throw new TypeError('modelName should be a string or have a .toString method!');
  }
  modelName = modelName.toString();

  if (!Model[modelName]){
    attributesPrototype = (modelDescription.attributes || {});
    Model[modelName] = Object.create(baseModelClass, {
      name: _protected(modelName),
      attributesPrototype: _hidden(attributesPrototype),
      baseInstance: _protected(createBaseModelInstance(attributesPrototype)),
      store: _protected([])
    });
  }
  return Model[modelName];
}

module.exports = Model;
