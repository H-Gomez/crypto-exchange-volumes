const express = require('express');
const path = require('path');
const http = require('http');
const mongodb = require('mongodb');
const charts = require('./app/js/charts');
var database;

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
const url = 'mongodb://localhost:27017/exchanges';
MongoClient.connect(url, (err, client) => {
    if (err) {
        return console.log(err);
    }

    database = client.db('exchanges');
    app.listen(port, () => console.log(`Listening on port ${port}`));
});

//
// Routes
/////////////////////////////// 
app.get('/', (req, res) => {
    database.collection('tradeVolumes').find().toArray((err, result) => {
        if (err) return console.log('failed');
        let chartData = charts.filterDataset(result);
        res.send(chartData);
        // res.render('index', { cData : chartData});
    });
});

//
// 404 Route
///////////////////////////////
app.get('*', (req, res) => res.render('index'));


