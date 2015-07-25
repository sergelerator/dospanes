'use strict';

function mixin(baseObject, mixinObject){
  for (var mixinProperty in mixinObject) {
    if (baseObject[mixinProperty] === undefined) {
      baseObject[mixinProperty] = mixinObject[mixinProperty];
    }
  }
}

module.exports = mixin;
