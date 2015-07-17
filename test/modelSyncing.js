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
    it('returns a Promise', function(){
      var promise = Model.notifySyncTargets();
      expect(promise).to.be.a('promise');
    });

    it('notifies the sync target', function(done){
      Model.notifySyncTargets().then(function(){
        expect(syncSpy).to.have.been.called.once();
        expect(syncSpy).to.have.been.called.with({});
        done();
      });
    });

    it('the returned promise resolves to the syncTarget data', function(done){
      var promise;
      promise = Model.notifySyncTargets();

      expect(promise).to.be.fulfilled;
      expect(promise).to.eventually.deep.equal([{}]).notify(done);
    });

    it('the returned promise rejects if one of the sync targets rejects', function(done){
      var promise, syncTargets;

      Model.removeSyncTarget(syncTarget);

      Model.addSyncTarget(new SyncTarget({}, 0, false));
      Model.addSyncTarget(new SyncTarget({}, 0, false));
      Model.addSyncTarget(new SyncTarget({}, 5, true));

      promise = Model.notifySyncTargets();

      expect(promise).to.be.rejectedWith(Error).notify(done);

      Model.clearSyncTargets();
    });

    it('the returned promise sends the result of all promises to it\'s own "then"', function(done){
      var promise, syncTargets;

      Model.removeSyncTarget(syncTarget);

      Model.addSyncTarget(new SyncTarget({one: 1}, 0));
      Model.addSyncTarget(new SyncTarget({two: 2}, 0));
      Model.addSyncTarget(new SyncTarget({three: 3}, 0));

      promise = Model.notifySyncTargets();

      expect(promise).to.eventually.deep.equal([{one: 1}, {two: 2}, {three: 3}]).notify(done);
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
