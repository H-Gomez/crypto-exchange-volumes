const assert = require('chai').assert;
const expect = require('chai').expect;
const sanitiseStringToNumber = require('../core').sanitiseStringToNumber;
const database = require('../lib/database');

describe('Sanitise A String To Number', function() {
    it('Should return a type of number', function() {
        let result = sanitiseStringToNumber('1234');
        assert.typeOf(result, 'number');
    });
});

describe('Connect To The Database', function() {
    it('Should be able to establish a connection to the database', function() {
        let result = database.connectToDatabase();
    });
});