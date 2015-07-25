'use strict';

var Attribute = require('../attribute'),

    Store = require('./store'),

    accessors = require('./accessors'),
    _defaultGetter = accessors._defaultGetter,
    _defaultSetter = accessors._defaultSetter,

    instanceMethods = require('./instanceMethods'),

    relations = require('./relations'),

    mixin = require('../utils/mixin'),

    propertyDescriptorBuilders = require('../utils/propertyDescriptorBuilders'),
    _hidden = propertyDescriptorBuilders._hidden,
    _protected = propertyDescriptorBuilders._protected,
    _writable = propertyDescriptorBuilders._writable,

    syncSource = require('../sync_objects/syncSource'),
    syncTarget = require('../sync_objects/syncTarget');


/**********************************************************
* Prototypes for Model classes and instances
**********************************************************/

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
      __isDirty__: _writable(false),
      isDirty:  _hidden(instanceMethods.isDirty),
      save:     _hidden(instanceMethods.save)
    });

/**********************************************************
* End of prototypes for Model classes and instances
**********************************************************/


/**********************************************************
* Internal state
**********************************************************/

var defaultSyncSources = [],
    defaultSyncTargets = [];

/**********************************************************
* End of internal state
**********************************************************/


/**********************************************************
* Private, internal utility functions
**********************************************************/

// Given both an attributes prototype and a methods
// prototype, creates an object to use as a prototype for
// creating model instances
function createBaseModelInstance(attributesPrototype, relationsPrototype, methodsPrototype){
  var baseInstance = Object.create(baseModelInstance, {});

  for (var attributeName in attributesPrototype) {
    var attribute = attributesPrototype[attributeName];

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

  relationsPrototype.forEach(function(relation){
    var relationStore;
    if (relation.type === 'hasMany') {
      relationStore = new Store(relation.model);
      Object.defineProperty(baseInstance, relation.relationName, _hidden(relationStore));
    } else {
      Object.defineProperty(baseInstance, relation.relationName, _writable(null));
    }
  });

  for (var methodName in methodsPrototype) {
    var method = methodsPrototype[methodName];
    Object.defineProperty(baseInstance, methodName, _hidden(method));
  }

  return baseInstance;
}

/**********************************************************
* End of private functions
**********************************************************/


/**********************************************************
* Public, these functions are part of the API of any
* objects built by calling `Model`
**********************************************************/

// Creates an instance of a model with the provided attributes.
// The new object is stored in the Model store.
function build(attributes){
  var instance = Object.create(this.baseInstance, {
    attributes: _hidden({}),
    _model: _hidden(this.name)
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

/**********************************************************
* End of public functions
**********************************************************/

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
  var attributesPrototype, methodsPrototype, relationsPrototype, resourcePath;

  if (modelName === undefined || typeof modelName.toString !== 'function') {
    throw new TypeError('modelName should be a string or have a .toString method!');
  }
  modelName = modelName.toString();

  if (!Model[modelName]){
    attributesPrototype = (modelDescription.attributes || {});
    relationsPrototype = (modelDescription.relations || []);
    methodsPrototype = (modelDescription.methods || {});
    resourcePath = modelDescription.resourcePath;

    Model[modelName] = Object.create(baseModelClass, {
      name: _protected(modelName),

      attributesPrototype: _hidden(attributesPrototype),
      baseInstance: _protected(createBaseModelInstance(attributesPrototype, relationsPrototype, methodsPrototype)),
      resourcePath: _hidden(resourcePath),
      store: _hidden(new Store(modelName))
    });
  }
  return Model[modelName];
}

mixin(Model, relations);


/**********************************************************
* Data syncing
**********************************************************/

syncTarget.mixInto(Model);
syncSource.mixInto(Model);

Model.sync = function sync(data){
  var modelName, modelClass, updatedData;
  return new Promise(function(resolve, reject){
    for (modelName in data) {
      modelClass = Model[modelName];

      data[modelName].items.forEach(function(item) {
        // TODO update the attributes of affected model instances
      });
    }
    updatedData = Object.create(data, {});
    resolve(updatedData);
  });
};

module.exports = Model;
