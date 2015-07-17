'use strict';

var syncSource = require('../../lib/sync_objects/syncSource');

function SyncSource() {
  var source = {};

  syncSource.mixInto(source);
  return source;
}

module.exports = SyncSource;
