const mongodb = require('mongodb');
const config = require('../config/database');
const MongoClient = mongodb.MongoClient;
let database;

/**
 * Establish a connect to the database is one does not exist.
 */
function connectToDatabase() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(
            config.mongoURI,
            (error, client) => {
                if (error) {
                    reject(`Unable to connect to the database: ${error}`);
                }

                database = client.db('crypto-exchanges');
                resolve();
            }
        );
    });
}

/**
 * Inserts the total volume value into the database.
 * @param {int} data
 */
function addTotalVolumesToDatabase(data) {
    let collection = database.collection('volumeTotal');
    collection.insert(data, function(error, inserted) {
        if (error) {
            console.log(`Database insert for total volume failed: ${error}`);
        } else {
            console.log('Data insert complete');
        }
    });
}

module.exports = {
    connectToDatabase: connectToDatabase,
    addTotalVolumes: addTotalVolumesToDatabase
};
