const assert = require('chai').assert;
const expect = require('chai').expect;

const sanitiseStringToNumber = require('../core').sanitiseStringToNumber;
//const sanitiseStringToNumber = require('../main').sanitiseStringToNumber;

describe('Sanitise A String To Number', function() {
    it('Should return a type of number', function() {
        let result = sanitiseStringToNumber('1234');
        assert.typeOf(result, 'number');
    });
});
