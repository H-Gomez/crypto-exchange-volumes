/** Handler for the CoinCap API functionality */
const request = require('request');
const baseUrl = "https://api.coincap.io/v2/exchanges";

request(baseUrl, (response, error, data) => {
    console.log(data);
});

/**
 * Calcuates the total volume for the day based on the data that is passed into this functions
 * Expects a cleaned array.
 * @param {*} dataset 
 */
function calculateTotalVolume(dataset) {
    let totalVol;
};