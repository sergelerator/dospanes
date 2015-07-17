'use strict';

function SyncTarget(data, delay, fail) {
  var returnData = (data || {}),
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
        if (fail) {
          reject(Error('Failed'));
        } else {
          resolve(returnData);
        }
      }, delay);
    });
  }

  return Object.create(syncTarget, {});
}

module.exports = SyncTarget;
