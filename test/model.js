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

    afterEach(function(){
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

  describe('with model name "Repeated"', function(){
    var modelName, modelDescription, model;

    before(function(){
      modelName = 'Repeated';
      modelDescription = {};
    });

    beforeEach(function(){
      model = Model(modelName, modelDescription);
    });

    it('returns a reference to the object stored as a property of "Model"', function(){
      expect(model).to.equal(Model[modelName]);
    });

    it('returns the same object if called twice', function(){
      var secondCall = Model(modelName, {});
      expect(model).to.equal(secondCall);
    });
  });
});

describe('model.build', function(){
  var modelName, modelDescription, model, attributes;

  describe('"User" model', function(){
    var user;

    before(function(){
      modelName = 'User';
      modelDescription = {
        attributes: {
          firstName: Attribute.text,
          lastName: Attribute.text,

          fullName: Attribute.computed(function(){
            return this.firstName + ' ' + this.lastName;
          })
        }
      };
      model = Model(modelName, modelDescription);
    });

    after(function(){
      if (Model[modelName]) {
        delete Model[modelName];
      }
    });

    describe('with attributes param', function(){
      var firstName, lastName;

      before(function(){
        firstName = 'Tyrion', lastName = 'Lannister';
        attributes = {
          firstName: firstName,
          lastName: lastName
        };
        user = model.build(attributes);
      });

      it('has a firstName property equal to "Tyrion"', function(){
        expect(user).to.have.property('firstName').and.equal(firstName);
      });

      it('has a lastName property equal to "Lannister"', function(){
        expect(user).to.have.property('lastName').and.equal(lastName);
      });

      it('has a fullName property equal to "Tyrion Lannister"', function(){
        expect(user).to.have.property('fullName').and.equal('Tyrion Lannister');
      });
    });
  });
});
