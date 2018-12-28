const assert = require('chai').assert;
const expect = require('chai').expect;
const prices = require('../lib/prices');

describe('Get Bitcoin price from external API', () => {
    it('Should return a price', () => {
        prices.getTickerPrices();
    });
});