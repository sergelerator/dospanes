'use strict';

var propertyDescriptorBuilders = require('../utils/propertyDescriptorBuilders'),
    _hidden = propertyDescriptorBuilders._hidden,
    _open = propertyDescriptorBuilders._open,
    _protected = propertyDescriptorBuilders._protected,

    mixin = require('../utils/mixin');

function push(){
  var itemsToAdd = Array.prototype.slice.apply(arguments),
      expectedModel = this.model;

  this.items.push.apply(this.items, itemsToAdd.filter(function(item){
    return item._model === expectedModel;
  }));
}

function length(){
  return this.items.length;
}

function Store(model){
  this.items = [];
  Object.defineProperties(this, {
    items: _protected([]),
    model: _hidden(model)
  });
  return this;
}

Store.prototype = Object.create({}, {
  push: _open(push),
  length: {
    get: length
  }
});

module.exports = Store;
