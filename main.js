const request = require('request');
const cheerio = require('cheerio');
const mongodb = require('mongodb');

const baseUrl = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
const volumesArray = [];

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
            array.forEach(function(item) {
                collection.insert(item, function(error, inserted) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(inserted);
                    }
                });
            });

            return;
        }
    });
}

/**
 * Removes all commas and currency symbols from a string before formatting to a number. 
 * @param {*} string 
 */
function sanitiseStringToNumber(string) {
    let number;
    let substring = string.replace(/,/g, '')
    substring = substring.substr(1);
    number = parseFloat(substring);
    return number;
}

/**
 * Request to get all exchange values from the target website. Builds an arra with the results
 * and passes to the database handler method. 
 */
request(baseUrl, (error, response, body) => {
    if (!error) {
        const $ = cheerio.load(body);
        const tableRows = $('.table-condensed tbody tr')
        var exchangeName;

        tableRows.each(function(index, element) {
            if (element.attribs.id) {
                var aa = $(element).nextUntil('tr').attr('id');
                var correctElement = tableRows[index - 1];
                if (correctElement) {
                    var volumeValue = $(correctElement).find('.volume').text();
                    volumeValue = sanitiseStringToNumber(volumeValue);
                    volumesArray.push({ 
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

        AddVolumesToDatabase(volumesArray);

    } else {
        console.log(`Unable to complete the request: ${error}`);
    }
});

console.log('At the end');
