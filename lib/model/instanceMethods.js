'use strict';

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

module.exports = {
  isDirty: isDirty,
  save: save
};
