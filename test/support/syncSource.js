'use strict';

function SyncSource(initialData) {
  var data = {},
      onUpdateHandlers = [],
      syncSource = {
        clear: clear,
        onUpdate: onUpdate,
        triggerUpdate: triggerUpdate
      };

  function clear(){
    onUpdateHandlers = [];
  }

  function onUpdate(handler){
    onUpdateHandlers.push(handler);
  }

  function setData(newData){
    if (typeof newData === 'object') {
      data = newData;
    } else {
      throw(new TypeError('sync source data should be an object'));
    }
  }

  function triggerUpdate(){
    var syncPromises = onUpdateHandlers.map(function(handler){
      return handler(data);
    });
    return Promise.all(syncPromises);
  }

  return Object.create(syncSource, {});
}

module.exports = SyncSource;
