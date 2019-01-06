const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const charts = require('./app/js/charts');
const config = require('./config/database');
const prices = require('./lib/prices');
let database;

// Express app setup
// ---------------------------
const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);

//
// Middleware
// ---------------------------
app.use(express.static(__dirname + '/app'));
app.use(totalVolumes);
app.use(prices.getTickerPrices);
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'jade');

//
// Connect to the Mongo Database
// ---------------------------
const MongoClient = mongodb.MongoClient;
MongoClient.connect(
    config.mongoURI,
    (err, client) => {
        if (err) {
            return console.log(`Unable to connect to the database: ${err}`);
        }

        database = client.db('crypto-exchanges');
        app.listen(port, () => console.log(`Listening on port ${port}...`));
    }
);

/**
 * Middleware function that gets the total volumes from the database and performs
 * a number of tasks against it such as calculate total
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function totalVolumes(req, res, next) {
    database
        .collection('volumeTotal')
        .find()
        .toArray((error, result) => {
            if (error) {
                return console.log(`Failed to get total volumes from exchange: ${error}`);
            }

            req.todayTotalVolume = result[result.length - 1].volume;
            req.totalVolumes = formatTotalVolumes(result);
            req.volume1Day = calculateVolumeChange(result, 1);
            req.volumeWeek = calculateVolumeChange(result, 7);
            req.volumeMonth = calculateVolumeChange(result, 30);
            next();
        });
}

/**
 * Creates a new array for the total volumes that doesn't include Mongo IDs.
 * @param {array} volumes
 */
function formatTotalVolumes(volumes) {
    let arr = [];
    volumes.forEach(item => {
        arr.push([item.date, item.volume]);
    });

    return arr;
}

/**
 * Formats a given number as currency and abbreviates it after rounding.
 * @param {number} number
 */
function formatCurrency(number) {
    decimalPlaces = 20;
    let roundings = ['K', 'M', 'B', 'T'];

    for (var i = roundings.length - 1; i >= 0; i--) {
        let size = Math.pow(10, (i + 1) * 3);
        if (size <= number) {
            number = Math.round((number * decimalPlaces) / size) / decimalPlaces;
            number += roundings[i];
            break;
        }
    }

    return number;
}

/**
 * Calculates the percentage change between two values. Takes in the dataset and uses the days
 * parameter to define which array index to compare to. 
 * @param {array} dataset 
 * @param {number} days 
 */
function calculateVolumeChange(dataset, days) {
    let lastVolume = dataset[dataset.length - 1].volume;
    let compareVolume = dataset[dataset.length - (days + 1)].volume;
    let difference = lastVolume - compareVolume;
    let result = (difference / compareVolume) * 100.0;
    return `${result.toFixed(2)}%`;
}

//
// Routes
// ---------------------------
app.get('/', (req, res) => {
    res.render('index', {
        volumeData: {
            volume1day: req.volume1Day,
            volumeWeek: req.volumeWeek,
            volumeMonth: req.volumeMonth,
            todayTotalVolume: formatCurrency(req.todayTotalVolume)
        },
        btcVolume: formatCurrency(req.todayTotalVolume / req.bitcoinPrice)
    });
});

app.get('/charts/all', (req, res) => {
    database
        .collection('volumes')
        .find()
        .toArray((err, result) => {
            if (err) {
                return console.log(`Failed to get chart data: ${err}`);
            }
            let chartData = charts.filterDataset(result);
            res.send(chartData);
        });
});

app.get('/volumes/total', (req, res) => {
    res.send(req.totalVolumes);
});

//
// 404 Route
// ---------------------------
app.get('*', (req, res) => res.render('index'));
