const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const charts = require('./app/js/charts');
const config = require('./config/database');
const middleware = require('./lib/middleware')
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

function totalVolumes(req, res, next) {
    database
        .collection('volumeTotal')
        .find()
        .toArray((error, result) => {
            if (error) {
                return console.log(
                    `Failed to get total volumes from exchange: ${error}`
                );
            }

            req.todayTotalVolume = formatCurrency(result[0].volume);
            req.totalVolumes = formatTotalVolumes(result);
            next();
        });
};

function formatTotalVolumes(volumes) {
    let arr = [];
    volumes.forEach((item) => {
        arr.push([
            item.date,
            item.volume
        ])
    })

    return arr;
}

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

//
// Routes
// ---------------------------
app.get('/', (req, res) => {
    res.render('index', { 
        todayTotalVolume: req.todayTotalVolume,
        totalVolumes: JSON.stringify(req.totalVolumes)
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
