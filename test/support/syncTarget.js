'use strict';

function SyncTarget() {
  var data = {},
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
      if (data.fail) {
        reject(Error('Failed'));
      } else {
        data = data;
        resolve(data);
      }
    });
  }

  return Object.create(syncTarget, {});
}

module.exports = SyncTarget;
