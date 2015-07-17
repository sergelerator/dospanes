'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    chaiSpies = require('chai-spies'),
    mocha = require('mocha'),
    expect = chai.expect,

    DosPanes = require('../'),
    Model = DosPanes.Model,
    SyncSource = require('./support/syncSource'),
    SyncTarget = require('./support/syncTarget');

chai.use(chaiAsPromised);
chai.use(chaiSpies);


describe('Model as sync source', function(){
  var originalSync, syncSpy, syncTarget;

  beforeEach(function(){
    syncTarget = new SyncTarget();
    originalSync = syncTarget.sync;
    syncSpy = chai.spy(syncTarget.sync);
    syncTarget.sync = syncSpy;
    Model.addSyncTarget(syncTarget);
  });

  afterEach(function(){
    Model.removeSyncTarget(syncTarget);
    syncTarget.sync = originalSync;
  });

  describe('.notifySyncTargets', function(){
    it('notifies the sync target', function(){
      Model.notifySyncTargets();
      expect(syncSpy).to.have.been.called.once();
      expect(syncSpy).to.have.been.called.with({});
    });

    it('returns a Promise', function(){
      var promise = Model.notifySyncTargets();
      expect(promise).to.be.a('promise');
    });

    it('the returned promise resolves to the syncTarget data', function(){
      var syncTargetData = { attribute: 'value' },
          promise;
      syncTarget.setData(syncTargetData);
      promise = Model.notifySyncTargets();

      expect(promise).to.eventually.equal(syncTargetData);
    });
  });
});

describe('Model as sync target', function(){
  var originalSync, syncSpy, syncSource;

  beforeEach(function(){
    syncSource = new SyncSource();
    originalSync = Model.sync;
    syncSpy = chai.spy(Model.sync);
    Model.sync = syncSpy;
    Model.addSyncSource(syncSource);
  });

  afterEach(function(){
    Model.sync = originalSync;
    syncSource.clear();
  });

  it('syncSource notifies the Model.sync function', function(){
    syncSource.triggerUpdate();
    expect(syncSpy).to.have.been.called.once();
    expect(syncSpy).to.have.been.called.with({});
  });
});
