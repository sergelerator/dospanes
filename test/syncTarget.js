'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    chaiSpies = require('chai-spies'),
    mocha = require('mocha'),
    expect = chai.expect,

    syncTarget = require('../lib/sync_objects/syncTarget');

chai.use(chaiAsPromised);
chai.use(chaiSpies);

describe('syncTarget', function(){
  describe('.mixInto', function(){
    it('copies over the syncTarget functions to an object', function(){
      var subject = {};
      syncTarget.mixInto(subject);

      expect(subject).to.have.property('addSyncSource').and.be.a('function');
      expect(subject).to.have.property('sync').and.be.a('function');
    });
  });

  describe('mixed in functions', function(){
    var subject, source, onUpdateSpy;

    beforeEach(function(){
      subject = {};
      onUpdateSpy = chai.spy();
      syncTarget.mixInto(subject);

      source = { onUpdate: onUpdateSpy };
    });

    describe('.addSyncSource', function(){
      it('calls the onUpdate method of the syncSource', function(){
        subject.addSyncSource(source);

        expect(onUpdateSpy).to.have.been.called.once.with(subject.sync);
      });
    });

    describe('.sync', function(){
      it('returns a Promise', function(){
        expect(subject.sync()).to.be.a('promise');
      });

      it('returns a rejected Promise', function(){
        expect(subject.sync()).to.be.rejectedWith(Error);
      });
    });
  });
});
