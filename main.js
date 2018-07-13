const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const mongodb = require('mongodb');

const baseUrl = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
const volumesArray = [];

const arr = [
    {
        "name": "bitfinex",
        "volume": 101,
        "timestamp": 1500
    },
    {
        "name": "huobi",
        "volume": 122,
        "timestamp": 15847
    }
];

function AddVolumesToDatabase(array) {
    var MongoClient = mongodb.MongoClient;
    var url = 'mongodb://localhost:27017/exchanges';

    MongoClient.connect(url, function(err, client) {
        if (err) {
            console.log('Unable to connect to the databse');
        } else {
            console.log('Databse connection established.');

            var db = client.db('exchanges');
            var collection = db.collection('tradeVolumes');
           
            arr.forEach(function(doc) {
                collection.insert(doc);
            });

        }
    })
}

AddVolumesToDatabase();

// request(baseUrl, (error, response, body) => {
//     if (!error) {
//         const $ = cheerio.load(body);
//         const tableRows = $('.table-condensed tbody tr')
//         var exchangeName;

//         tableRows.each(function(index, element) {
//             if (element.attribs.id) {
//                 var aa = $(element).nextUntil('tr').attr('id');
//                 var correctElement = tableRows[index - 1];
//                 if (correctElement) {
//                     var volumeValue = $(correctElement).find('.volume').text();
//                     volumeValue = sanitiseStringToNumber(volumeValue);
//                     volumesArray.push({ 
//                         'name': exchangeName,
//                         'volume': volumeValue,
//                         'timestamp': Date.now() 
//                     })
//                 } else {
//                     console.log('Issue with element: ' + element);
//                 }
//                 exchangeName = element.attribs.id;
//             }
//         });

//         console.log(volumesArray);

//     } else {
//         console.log(`Unable to complete the request: ${error}`);
//     }
// });

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