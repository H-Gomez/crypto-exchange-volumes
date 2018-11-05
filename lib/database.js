const mongodb = require('mongodb');
const config = require('../config/database');
const MongoClient = mongodb.MongoClient;
let database;
let dbClient;

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
                dbClient = client;
                database = client.db('crypto-exchanges');
                console.log('Connected to the database.')
                resolve();
            }
        );
    });
}

/**
 * Handles the inserting of an array into the mongoDB database.
 * @param {array} array
 */
function AddVolumesToDatabase(array) {
    let collection = database.collection('volumes');
    array.forEach((item, index) => {
        collection.insert(item, function(error, inserted) {
            if (error) {
                console.log(`Database insert failed: ${error}`);
            } else if (index + 1 == array.length) {
                console.log('Exchange volumes insert completed.');
            }
        });
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
            console.log('Total volumes insert complete');
        }
    });
}

/**
 * Close the database on request.
 */
function closeDatabase() {
    if (database) {
        console.log('Closing DB connection');
        dbClient.close();
    }
}

module.exports = {
    connectToDatabase: connectToDatabase,
    addvolumes: AddVolumesToDatabase,
    addTotalVolumes: addTotalVolumesToDatabase,
    closeDatabase: closeDatabase
};
