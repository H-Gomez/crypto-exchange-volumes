const mongodb = require('mongodb');
const config = require('../config/database');
let database;

// 
// Connect to the Mongo Database
///////////////////////////////
const MongoClient = mongodb.MongoClient;
MongoClient.connect(config.mongoURI, (err, client) => {
    if (err) {
        return console.log(`Unable to connect to the database: ${err}`);
    }

    database = client.db('crypto-exchanges');
    app.listen(port, () => console.log(`Listening on port ${port}...`));
});

/**
 * Inserts the total volume value into the database.
 * @param {int} data 
 */
function addTotalVolumesToDatabase(data) {
    let collection = db.collection('totalVolumes');    
    collection.insert(data, function(error, inserted) {
        if (error) {
            console.log(`Database insert for total volume failed: ${error}`);
        } else {
            console.log('Data insert complete');
        }
    });
}

module.exports = {
    addTotalVolumes: addTotalVolumesToDatabase
};