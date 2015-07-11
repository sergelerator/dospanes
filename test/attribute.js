'use strict';

var chai = require('chai'),
    mocha = require('mocha'),
    expect = chai.expect,

    DosPanes = require('../'),
    Attribute = DosPanes.Attribute;


describe('Attribute', function(){
  describe('called without config objects', function(){
    var attribute = Attribute();

    it('returns an object', function(){
      expect(attribute).to.be.an('object');
    });

    it('returns an object with `type` = null', function(){
      expect(attribute).to.have.property('type');
      expect(attribute.type).to.equal(null);
    });

    it('returns an object with a default validator function', function(){
      expect(attribute).to.have.property('validator');
      expect(attribute.validator()).to.equal(true);
    });
  });

  describe('called with type "text"', function(){
    var attribute = Attribute({ type: 'text' });

    it('returns an object', function(){
      expect(attribute).to.be.an('object');
    });

    it('returns an object with `type` = "text"', function(){
      expect(attribute).to.have.property('type');
      expect(attribute.type).to.equal('text');
    });

    it('returns an object which `type` property cannot be written to', function(){
      expect(function(){ attribute.type = 'not text'; }).to.throw(TypeError);
    });
  });

  describe('.text', function(){
    it('is an object', function(){
      expect(Attribute.text).to.be.an('object');
    });

    it('has a `type` property equal to "text"', function(){
      expect(Attribute.text).to.have.property('type');
      expect(Attribute.text.type).to.equal('text');
    });

    it('has a `type` property which cannot be written to', function(){
      expect(function(){ Attribute.text.type = 'not text'; }).to.throw(TypeError);
    });
  });

  describe('.number', function(){
    it('is an object', function(){
      expect(Attribute.number).to.be.an('object');
    });

    it('has a `type` property equal to "number"', function(){
      expect(Attribute.number).to.have.property('type');
      expect(Attribute.number.type).to.equal('number');
    });

    it('has a `type` property which cannot be written to', function(){
      expect(function(){ Attribute.number.type = 'not number'; }).to.throw(TypeError);
    });
  });

  describe('.computed', function(){
    it('is a function', function(){
      expect(Attribute.computed).to.be.a('function');
    });

    describe('when called with a function as the single argument', function(){
      function arg(){ return 42; };

      var attribute = Attribute.computed(arg);


      it('returns an object with `type` = "computed"', function(){
        expect(attribute).to.have.property('type');
        expect(attribute.type).to.equal('computed');
      });

      it('returns an object which `type` property cannot be written to', function(){
        expect(function(){ attribute.type = 'not computed'; }).to.throw(TypeError);
      });
    });
  });
});
