'use strict';

var chai = require('chai'),
    mocha = require('mocha'),
    expect = chai.expect,

    DosPanes = require('../'),
    Model = DosPanes.Model,
    Attribute = DosPanes.Attribute;


describe('Model', function(){
  describe('called without a model name', function(){
    it('throws a TypeError exception', function(){
      expect(function(){ Model(); }).to.throw(TypeError);
    });
  });

  describe('with model name "User"', function(){
    var modelName;

    before(function(){
      modelName = 'User';
    });

    beforeEach(function(){
      if (Model[modelName]) {
        delete Model[modelName];
      }
    });

    describe('called with empty modelDescription', function(){
      var user;

      before(function(){
        user = Model(modelName, {});
      });

      it('returns an object', function(){
        expect(user).to.be.an('object');
      });

      it('has the name "User"', function(){
        expect(user.name).to.equal(modelName);
      });

      it('has an empty attributesPrototype', function(){
        expect(user.attributesPrototype).to.deep.equal({});
      });

      it('has an empty store', function(){
        expect(user.store).to.deep.equal([]);
      });
    });

    describe('called with user attributes in the modelDescription', function(){
      var modelDescription, user;

      before(function(){
        modelDescription = {
          attributes: {
            firstName: Attribute.text,
            lastName: Attribute.text,

            fullName: Attribute.computed(function(){
              return this.firstName + ' ' + this.lastName;
            })
          }
        };
        user = Model(modelName, modelDescription);
      });

      it('returns an object', function(){
        expect(user).to.be.an('object');
      });

      it('has the name "User"', function(){
        expect(user.name).to.equal(modelName);
      });

      it('has the attributesPrototype', function(){
        expect(user.attributesPrototype).to.equal(modelDescription.attributes);
      });

      it('has an empty store', function(){
        expect(user.store).to.deep.equal([]);
      });
    });
  });
});
