/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var index = require('../');

describe('[index]', function () {
    it('exports a function', function () {
        expect(index).to.be.a('function');
    });

    it('has a "taskNames" method', function () {
        expect(index).to.have.property('taskNames').and.to.be.an('array');
    });

    it('has a getter for "additionalNames"', function () {
        expect(index).to.have.property('additionalNames').and.to.be.an('array');
    });
});
