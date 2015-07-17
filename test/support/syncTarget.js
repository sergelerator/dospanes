'use strict';

var syncTarget = require('../../lib/sync_objects/syncTarget'),
    defaultSyncTarget = {};

function SyncTarget(data, delay, fail) {
  var returnData = (data || {}),
      delay = (delay || 1),
      target = {};

  syncTarget.mixInto(target);

  target.sync = function sync(data){
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

  return target;
}

syncTarget.mixInto(defaultSyncTarget);
SyncTarget.Default = defaultSyncTarget;

module.exports = SyncTarget;
