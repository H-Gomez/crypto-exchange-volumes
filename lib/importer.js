const mongodb = require('mongodb');
const docs = require('./dbimport');
const config = require('../config/database');

/**
 * Quick import for local files into Mongo. 
 * @param {array} array
 */
function databaseImport(array) {
    const MongoClient = mongodb.MongoClient;
    const url = config.mongoURI;

    MongoClient.connect(url, function(error, client) {
        if (error) {
            console.log('Unable to connect to the databse');
        } else {
            console.log('Databse connection established.');
            console.log(array);
            var db = client.db('crypto-exchanges');
            var collection = db.collection('volumes');           
            array.forEach(function(item, index) {
                collection.insert(item, function(error, inserted) {
                    if (error) {
                        console.log(`Database insert FAILED: ${error}`);
                    } else if (index + 1 == array.length) {
                        console.log("Database insert completed.");
                        client.close();
                    }
                });
            });
        }
    });
}

databaseImport(docs.data);