const request = require('request');
const cheerio = require('cheerio');
const mongodb = require('mongodb');

const baseUrl = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
const exchanges = [ 'binance','bitfinex','okex','huobi','bittrex', 'poloniex', 'cryptopia', 'bittrex','bitstamp', 'kraken', 'coinbase-pro', 'bithumb', 'simex', 'digifinex', 'zb-com', 'bibox', 'bit-z']
var volumesArray = [];


/**
 * Handles the inserting of an array into the mongoDB database.
 * @param {array} array 
 */
function AddVolumesToDatabase(array) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/exchanges';

    MongoClient.connect(url, function(error, client) {
        if (error) {
            console.log('Unable to connect to the databse');
        } else {
            console.log('Databse connection established.');
            var db = client.db('exchanges');
            var collection = db.collection('tradeVolumes');           
            array.forEach(function(item, index) {
                collection.insert(item, function(error, inserted) {
                    if (error) {
                        console.log(`Database insert FAILED: ${error}`);
                    } else if (index + 1 == array.length) {
                        console.log("Database insert completed.")
                        client.close();
                    }
                });
            });
        }
    });
}

/**
 * Filters the JSON data response from the crawled site and builds a new array for only the prices
 * associated with the exchanges in the defined array called exchanges. 
 * @param {object} array 
 */
function filterJsonResponse(array) {
    let dispoableArray = [];
    array.forEach(function(item, index) {
        if (exchanges.includes(item.name)) {
            dispoableArray.push(item);
        }
    });
    
    return dispoableArray;
}

/**
 * Removes all commas and currency symbols from a string before formatting to a number. 
 * @param {string} string 
 * @returns {number} 
 */
function sanitiseStringToNumber(string) {
    let number;
    let substring = string.replace(/,/g, '')
    substring = substring.substr(1);
    number = parseFloat(substring);
    return number;
}

/**
 * Request to get all exchange values from the target website. Builds an array with the results
 * and passes to the database handler method. 
 */
function crawlSite() {
    request(baseUrl, (error, response, body) => {
        if (!error) {
            const $ = cheerio.load(body);
            const tableRows = $('.table-condensed tbody tr')
            const localArray = [];
            var exchangeName;
    
            tableRows.each(function(index, element) {
                if (element.attribs.id) {
                    var correctElement = tableRows[index - 1];
                    if (correctElement) {
                        var volumeValue = $(correctElement).find('.volume').text();
                        volumeValue = sanitiseStringToNumber(volumeValue);
                        localArray.push({ 
                            'name': exchangeName,
                            'volume': volumeValue,
                            'timestamp': Date.now() 
                        })
                    } else {
                        console.log('Issue with element: ' + element);
                    }
                    exchangeName = element.attribs.id;
                }
            });
            console.log('JSON obtained from website');
            volumesArray = filterJsonResponse(localArray);
            console.log('Array prepared for insert, trying now...');
            AddVolumesToDatabase(volumesArray);
            console.log(" --- Job completed ---");
    
        } else {
            console.log(`Unable to complete the request: ${error}`);
        }
    });
}

crawlSite();