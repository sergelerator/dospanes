'use strict';

var propertyDescriptorBuilders = require('../utils/propertyDescriptorBuilders'),
    _open = propertyDescriptorBuilders._open;

function mixInto(object){
  var onUpdateHandlers = [];

  function addSyncTarget(syncTarget){
    this.onUpdate(syncTarget.sync);
  };

  function clearSyncTargets(){
    onUpdateHandlers = [];
  };

  function notifySyncTargets(){
    var data = {},
        syncPromises;

    syncPromises = onUpdateHandlers.map(function(handler){
      return handler(data);
    });
    return Promise.all(syncPromises);
  };

  function onUpdate(){
    var updateHandlers = Array.prototype.slice.apply(arguments);
    onUpdateHandlers.push.apply(onUpdateHandlers, updateHandlers);
  };

  function removeSyncTarget(syncTarget){
    var index = onUpdateHandlers.indexOf(syncTarget.sync);
    if (index !== -1) {
      onUpdateHandlers.splice(index, 1);
    }
  };

  Object.defineProperties(object, {
    addSyncTarget: _open(addSyncTarget),
    clearSyncTargets: _open(clearSyncTargets),
    notifySyncTargets: _open(notifySyncTargets),
    onUpdate: _open(onUpdate),
    removeSyncTarget: _open(removeSyncTarget)
  });
}

module.exports = {
  mixInto: mixInto
};
