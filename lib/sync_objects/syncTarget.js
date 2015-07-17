'use strict';

var propertyDescriptorBuilders = require('../utils/propertyDescriptorBuilders'),
    _open = propertyDescriptorBuilders._open;

function mixInto(object){
  function addSyncSource(syncSource){
    syncSource.onUpdate(this.sync);
  };

  function sync(data){
    return new Promise(function(resolve, reject){
      reject(Error('sync not implemented'));
    });
  };

  Object.defineProperties(object, {
    addSyncSource: _open(addSyncSource),
    sync: _open(sync)
  });
}

module.exports = {
  mixInto: mixInto
};
