'use strict';

var propertyDescriptorBuilders = require('../utils/propertyDescriptorBuilders'),
    _open = propertyDescriptorBuilders._open;

function mixInto(object){
  var onUpdateHandlers = [];

  function addSyncTarget(){
    var syncTargets = Array.prototype.slice.apply(arguments),
        syncHandlers = syncTargets.map(function(syncTarget){ return syncTarget.sync; });
    this.onUpdate.apply(this, syncHandlers);
  }

  function clearSyncTargets(){
    onUpdateHandlers = [];
  }

  function onUpdate(){
    var updateHandlers = Array.prototype.slice.apply(arguments);
    onUpdateHandlers.push.apply(onUpdateHandlers, updateHandlers);
    return onUpdateHandlers.length;
  }

  function removeSyncTarget(syncTarget){
    var index = onUpdateHandlers.indexOf(syncTarget.sync);
    if (index !== -1) {
      onUpdateHandlers.splice(index, 1);
    }
  }

  function triggerUpdate(){
    var data = {},
        syncPromises;

    syncPromises = onUpdateHandlers.map(function(handler){
      return handler(data);
    });
    return Promise.all(syncPromises);
  }

  Object.defineProperties(object, {
    addSyncTarget: _open(addSyncTarget),
    clearSyncTargets: _open(clearSyncTargets),
    onUpdate: _open(onUpdate),
    removeSyncTarget: _open(removeSyncTarget),
    triggerUpdate: _open(triggerUpdate)
  });
}

module.exports = {
  mixInto: mixInto
};
