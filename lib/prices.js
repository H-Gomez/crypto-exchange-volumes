const request = require('request');
const baseUrl = 'https://api.coincap.io/v2/assets/bitcoin';

/**
 * Gets the current market price for the asset defined in the baseURL.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function getTickerPrices(req, res, next) {
    request(baseUrl, (error, response, body )=> {
        if (!error) {
            let dataset = JSON.parse(body);
            let assetPrice = dataset.data.priceUsd
            req.bitcoinPrice = parseInt(assetPrice);
            next();
        } else {
            console.log(`Failed to get price from API: ${error}`);
        }
    });
}

module.exports = {
    getTickerPrices: getTickerPrices
};