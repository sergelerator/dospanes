'use strict';

function SyncTarget(initialData, delay) {
  var data = (initialData || {}),
      delay = (delay || 1),
      syncTarget = {
        setData: setData,
        sync: sync
      };

  function setData(newData){
    if (typeof newData === 'object') {
      data = newData;
    } else {
      throw(new TypeError('sync source data should be an object'));
    }
  }

  function sync(data){
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        if (data.fail) {
          reject(Error('Failed'));
        } else {
          data = data;
          resolve(data);
        }
      }, delay);
    });
  }

  return Object.create(syncTarget, {});
}

module.exports = SyncTarget;
