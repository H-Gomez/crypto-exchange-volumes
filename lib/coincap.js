/** Handler for the CoinCap API functionality */
const request = require('request');
const db = require('./database');
const baseUrl = "https://api.coincap.io/v2/exchanges";

/**
 * Gets the JSON data from the baseUrl API above. Sorts the response
 * and prepares it to be stored in the database.
 */
function getExchangeDataFromApi() {
    request(baseUrl, (response, error, result) => {
        let dataset = JSON.parse(result);
        let exchanges = [];
    
        dataset.forEach(function(item) {
            let exchange = {};
            exchanges.push({ 
                'name': item.name,
                'volume': itme.volumeUsd,
                'date': new Date().setUTCHours(0,0,0,0)
            });
        });

        return exchanges;
    });
}

function requestURl(url) {
    return new Promise(function(resolve, reject) {
        request(baseUrl, (response, error, result) => {
            let dataset = JSON.parse(result);
            let exchanges = [];
        
            dataset.forEach(function(item) {
                let exchange = {};
                exchanges.push({ 
                    'name': item.name,
                    'volume': itme.volumeUsd,
                    'date': new Date().setUTCHours(0,0,0,0)
                });
            });
    
            return resolve(exchanges);
        });
    });
}

/**
 * Calcuates the total volume for the day based on the data that is passed into this functions
 * Expects a cleaned array.
 * @param {*} dataset 
 */
function calculateTotalVolume(dataset) {
    var totalVol = 0;
    dataset.forEach(function(item) {
        if (item.volumeUsd > 0) {
            totalVol = totalVol + parseInt(item.volumeUsd);
        } else {
            console.log(`Exchange was excluded from volume count ${item.name}`);
        }
        
        return totalVol;
    });
}

console.log("Before Promise");

async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("I resolved"), 1000);
    });
  
    let result = await promise;
  
    console.log(result); // "done!"
  }
  
f();

console.log("After Promise");
//let response = getExchangeDataFromApi();
//let totalVolume = calculateTotalVolume(response);
//console.log(response);
//db.addTotalVolume(totalVolume);


/**
 * TODO
 * - View all exchanges on the same chart to get correct market share
 * - Migrate Datasource to coincap API
 * - Add alert or reporting should the data fetch not be completed
 * - In the reporting state if only a certain exchange was not completed.
 * - Correctly show legend for each exchange
 * - Add total volume value to the database each day
 * - Add endpoint to get total volume 
 * - Calculate total volume in bitcoin
 * - Show total volume in terms of total crypto market cap
 * - Show total crypto market cap
 */