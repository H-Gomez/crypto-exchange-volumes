/** Handler for the CoinCap API functionality */
const request = require('request');
const db = require('./database');
const baseUrl = 'https://api.coincap.io/v2/exchanges';

/**
 * Gets the JSON data from the baseUrl API above. Sorts the response
 * and prepares it to be stored in the database.
 */
function getExchangeDataFromApi() {
    return new Promise((resolve, reject) => {
        request(baseUrl, (error, response, body) => {
            if (!error) {
                let dataset = JSON.parse(body);
                let exchanges = [];
                dataset.data.forEach(item => {
                    exchanges.push({
                        exchangeId: item.exchangeId,
                        name: item.name,
                        volume: parseFloat(item.volumeUsd) > 0 ? parseFloat(item.volumeUsd) : 0,
                        rank: item.rank,
                        date: new Date().setUTCHours(0, 0, 0, 0)
                    });
                });

                resolve(exchanges);
            } else {
                reject(`Failed to get exchanges from API: ${error}`);
            }
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
    dataset.forEach(item => {
        if (item.volume > 0) {
            totalVol = totalVol + parseInt(item.volume);
        } else {
            console.log(`Exchange was excluded from volume count ${item.name}`);
        }
    });

    return {
        volume: totalVol,
        date: new Date().setUTCHours(0, 0, 0, 0)
    };
}

async function getData() {
    // Data fetch and handling
    let exchangeData = await getExchangeDataFromApi();
    let totalVolume = calculateTotalVolume(exchangeData);

    // Database inserts
    await db.connectToDatabase();
    db.addvolumes(exchangeData);
    db.addTotalVolumes(totalVolume);
}

getData();

/**
 * TODO
 * - View all exchanges on the same chart to get correct market share
 * - Add alert or reporting should the data fetch not be completed
 * - In the reporting state if only a certain exchange was not completed.
 * - Correctly show legend for each exchange
 * - Add total volume value to the database each day
 * - Add endpoint to get total volume
 * - Calculate total volume in bitcoin
 * - Show total volume in terms of total crypto market cap
 * - Show total crypto market cap
 */
