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

    it('the returned promise rejects if one of the sync targets rejects', function(){
      var promise, syncTargets;

      Model.removeSyncTarget(syncTarget);

      syncTargets = [
        (new SyncTarget({ one: 1 })),
        (new SyncTarget({ two: 2 })),
        (new SyncTarget({ fail: true }))
      ];
      Model.addSyncTarget.apply(Model, syncTargets);
      promise = Model.notifySyncTargets();

      expect(promise).to.reject;
    });

    it('the returned promise sends the result of all promises to it\'s own "then"', function(){
      var promise, syncTargets;

      Model.removeSyncTarget(syncTarget);

      syncTargets = [
        (new SyncTarget({ one: 1 })),
        (new SyncTarget({ two: 2 })),
        (new SyncTarget({ three: 3 }))
      ];
      Model.addSyncTarget.apply(Model, syncTargets);
      promise = Model.notifySyncTargets();

      expect(promise).to.eventually.deep.equal([{one: 1}, {two: 2}, {three: 3}]);
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
