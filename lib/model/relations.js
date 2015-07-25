'use strict';

function belongsTo(relationName, options){
  var model = (options.model || relationName);
  return {
    model: model,
    relationName: relationName,
    type: 'belongsTo'
  }
}

function hasMany(relationName, options){
  var model = (options.model || relationName);
  return {
    model: model,
    relationName: relationName,
    type: 'hasMany'
  }
}

module.exports = {
  belongsTo: belongsTo,
  hasMany: hasMany
};
