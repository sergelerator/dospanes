'use strict';

var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    mocha = require('mocha'),
    expect = chai.expect,

    DosPanes = require('../../'),
    Model = DosPanes.Model,
    Attribute = DosPanes.Attribute;

chai.use(chaiAsPromised);


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
        },
        methods: {
          say: function(message){
            return this.fullName + ': ' + message;
          }
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

      describe('after changing firstName', function(){
        before(function(){
          user.firstName = 'Cersei';
        });

        it('updates the return value of fullName', function(){
          expect(user).to.have.property('fullName').and.equal('Cersei Lannister');
        });
      });
    });

    describe('without attributes param', function(){
      var firstName, lastName;

      before(function(){
        user = model.build();
      });

      it('has a firstName property equal to ""', function(){
        expect(user).to.have.property('firstName').and.equal('');
      });

      it('has a lastName property equal to ""', function(){
        expect(user).to.have.property('lastName').and.equal('');
      });

      it('has a fullName property equal to " "', function(){
        expect(user).to.have.property('fullName').and.equal(' ');
      });

      it('allows to set the value of the lastName property"', function(){
        user.lastName = 'Jose';
        expect(user).to.have.property('lastName').and.equal('Jose');
      });
    });

    describe('methods', function(){
      var firstName, lastName;

      before(function(){
        firstName = 'Tyrion', lastName = 'Lannister';
        attributes = {
          firstName: firstName,
          lastName: lastName
        };
        user = model.build(attributes);
      });

      it('has a say method which returns "Tyrion Lannister: `message`"', function(){
        expect(user).to.respondTo('say');
        expect(user.say('We are gonna need more wine')).to.equal('Tyrion Lannister: We are gonna need more wine');
      });
    });

    describe('.isDirty', function(){
      beforeEach(function(){
        user = model.build({ firstName: 'Lara' });
      });

      it('returns false for just built models', function(){
        expect(user.isDirty()).to.equal(false);
      });

      it('returns true for models that have been altered', function(){
        user.firstName = 'Sara';
        expect(user.isDirty()).to.equal(true);
      });

      it('returns false after successfully persisting changes', function(){
        user.firstName = 'Sara';
        expect(user.isDirty()).to.equal(true);
        user.save().then(function(attributes){
          expect(user.isDirty()).to.equal(false);
        });
      });
    });

    describe('.save', function(){
      beforeEach(function(){
        user = model.build({ firstName: 'Lara' });
      });

      it('eventually returns the model\'s attributes', function(){
        expect(user.save()).to.eventually.equal(user.attributes);
      });
    });
  });
});
