'use strict';

var DosPanes = require('../../'),
    Model = DosPanes.Model,
    Attribute = DosPanes.Attribute;

module.exports = Model('Person', {
  attributes: {
    firstName: Attribute.text,
    lastName: Attribute.text,
    age: Attribute.number,

    fullName: Attribute.computed(function(){
      return this.firstName + ' ' + this.lastName;
    })
  }
});
