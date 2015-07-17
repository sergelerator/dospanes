'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    chaiSpies = require('chai-spies'),
    mocha = require('mocha'),
    expect = chai.expect,

    syncSource = require('../lib/sync_objects/syncSource');

chai.use(chaiAsPromised);
chai.use(chaiSpies);

describe('syncSource', function(){
  describe('.mixInto', function(){
    it('copies over the syncSource functions to an object', function(){
      var subject = {};
      syncSource.mixInto(subject);

      expect(subject).to.have.property('addSyncTarget').and.be.a('function');
      expect(subject).to.have.property('clearSyncTargets').and.be.a('function');
      expect(subject).to.have.property('onUpdate').and.be.a('function');
      expect(subject).to.have.property('removeSyncTarget').and.be.a('function');
      expect(subject).to.have.property('triggerUpdate').and.be.a('function');
    });
  });

  describe('mixed in functions', function(){
    var subject, target;

    beforeEach(function(){
      subject = {};
      syncSource.mixInto(subject);

      target = { sync: chai.spy() };
    });

    describe('.addSyncTarget', function(){
      var onUpdate, onUpdateSpy;

      beforeEach(function(){
        onUpdate = subject.onUpdate;
        onUpdateSpy = subject.onUpdate = chai.spy(subject.onUpdate);
      });

      afterEach(function(){
        subject.clearSyncTargets();
        subject.onUpdate = onUpdate;
      });

      it('calls onUpdate with the sync function of the argument', function(){
        subject.addSyncTarget(target);

        expect(onUpdateSpy).to.have.been.called.once.with(target.sync);
      });

      it('calls onUpdate with the sync function of all the argument', function(){
        var target1 = { sync: function(){} },
            target2 = { sync: function(){} },
            target3 = { sync: function(){} };

        subject.addSyncTarget(target1, target2, target3);

        expect(onUpdateSpy).to.have.been.called.once.with(target1.sync, target2.sync, target3.sync);
      });
    });

    describe('.onUpdate', function(){
      afterEach(function(){
        subject.clearSyncTargets();
      });

      it('returns the number of update handlers', function(){
        var result = subject.onUpdate(function(){}, function(){});

        expect(result).to.equal(2);

        result = subject.onUpdate(function(){}, function(){}, function(){});
        expect(result).to.equal(5);
      });
    });

    describe('.removeSyncTarget', function(){
      it('removes a single syncTarget', function(){
        var syncSpy = chai.spy(),
            target = { sync: syncSpy },
            result;
        subject.addSyncTarget(target);

        result = subject.onUpdate();
        subject.triggerUpdate();
        expect(syncSpy).to.have.been.called.once;

        subject.removeSyncTarget(target);
        subject.triggerUpdate();
        expect(syncSpy).to.have.been.called.once;
        expect(subject.onUpdate()).to.equal(result - 1);
      });
    });

    describe('.triggerUpdate', function(){
      describe('with 0 registered sync handlers', function(){
        beforeEach(function(){
          subject.clearSyncTargets();
        });

        it('returns a resolved promise', function(){
          expect(subject.triggerUpdate()).to.be.fulfilled;
        });

        it('eventually equals []', function(done){
          expect(subject.triggerUpdate()).to.eventually.deep.equal([]).notify(done);
        });
      });

      describe('with 3 registered sync handlers', function(){
        var spy1, spy2, spy3, target1, target2, target3;

        beforeEach(function(){
          spy1 = chai.spy(function(){ return 1; });
          spy2 = chai.spy(function(){ return 2; });
          spy3 = chai.spy(function(){ return 3; });
          target1 = { sync: spy1 };
          target2 = { sync: spy2 };
          target3 = { sync: spy3 };

          subject.addSyncTarget(target1, target2, target3);
        });

        afterEach(function(){
          subject.clearSyncTargets();
        });

        it('triggers all registered sync handlers', function(){
          subject.triggerUpdate();
          expect(spy1).to.have.been.called.once;
          expect(spy2).to.have.been.called.once;
          expect(spy3).to.have.been.called.once;
        });

        it('eventually equals [1, 2, 3]', function(done){
          expect(subject.triggerUpdate()).to.eventually.deep.equals([1, 2, 3]).notify(done);
        });
      });
    });
  });
});
