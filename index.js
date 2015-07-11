'use strict';

var modulePath = process.env.COVER ? './lib-cov' : './lib';
module.exports = require(modulePath);
