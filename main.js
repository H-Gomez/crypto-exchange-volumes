const request = require('request');
const cheerio = require('cheerio');
const mongodb = require('mongodb');
const log4js = require('log4js');

// Basic variable setup
const baseUrl = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
const exchanges = [ 'binance','bitfinex','okex','huobi','bittrex','poloniex','cryptopia','bittrex','bitstamp','kraken','coinbase-pro','bithumb','simex','digifinex','zb-com','bibox','bit-z','upbit'];
var volumesArray = [];

// Setup Logging
var logger = log4js.getLogger();
log4js.configure({
    appenders: { 
        out: { type: 'stdout' },
        node: { type: 'file', filename: 'output.log'}
     },
     categories: {
         default: { appenders: ['out', 'node'], level: 'debug' }
     }
});


/**
 * Handles the inserting of an array into the mongoDB database.
 * @param {array} array
 */
function AddVolumesToDatabase(array) {
    const MongoClient = mongodb.MongoClient;
    const url = 'mongodb://dbadmin:Exp3ll1Armu5s@ds159812.mlab.com:59812/crypto-exchanges';

    MongoClient.connect(url, function(error, client) {
        if (error) {
            logger.info('Unable to connect to the databse');
        } else {
            logger.info('Databse connection established.');
            var db = client.db('crypto-exchanges');
            var collection = db.collection('vols');           
            array.forEach(function(item, index) {
                collection.insert(item, function(error, inserted) {
                    if (error) {
                        logger.info(`Database insert FAILED: ${error}`);
                    } else if (index + 1 == array.length) {
                        logger.info("Database insert completed.");
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
    let substring = string.replace(/,/g, '');
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
            const tableRows = $('.table-condensed tbody tr');
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
                            'timestamp': new Date(new Date().setUTCHours(0,0,0,0))
                        });
                    } else {
                        logger.info('Issue with element: ' + element);
                    }
                    exchangeName = element.attribs.id;
                }
            });

            logger.info('JSON obtained from website');
            //volumesArray = filterJsonResponse(localArray);
            logger.info('Array prepared for insert, trying now...');
            AddVolumesToDatabase(localArray);
        } else {
            logger.info(`Unable to complete the request: ${error}`);
        }
    });
}

crawlSite();