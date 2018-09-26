const express = require('express');
const path = require('path');
const http = require('http');
const mongodb = require('mongodb');
const charts = require('./app/js/charts');
const config = require('./config/database');
let database;

// Express app setup
const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);

//
// Middleware
///////////////////////////////
app.use(express.static(__dirname + '/app/views'));
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

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

//
// Routes
/////////////////////////////// 
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/charts/all', (req, res) => {
    database.collection('tradeVolumes').find().toArray((err, result) => {
        if (err) {
            return console.log('Failed to get chart data');
        }
        let chartData = charts.filterDataset(result);
        res.send(chartData);
    });
});

//
// 404 Route
///////////////////////////////
app.get('*', (req, res) => res.render('index'));


