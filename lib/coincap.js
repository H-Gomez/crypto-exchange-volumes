/** Handler for the CoinCap API functionality */
const request = require('request');
const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const db = require('./database');
const baseUrl = 'https://api.coincap.io/v2/exchanges';

/**
 * Gets the JSON data from the baseUrl API above. Sorts the response
 * and prepares it to be stored in the database.
 */
function getExchangeDataFromApi() {
    return new Promise((resolve, reject) => {
        request(baseUrl, (error, response, body) => {
            if (!error) {
                let dataset = JSON.parse(body);
                let exchanges = [];
                dataset.data.forEach(item => {
                    exchanges.push({
                        exchangeId: item.exchangeId,
                        name: item.name,
                        volume: parseFloat(item.volumeUsd) > 0 ? parseFloat(item.volumeUsd) : 0,
                        rank: item.rank,
                        date: new Date().setUTCHours(0, 0, 0, 0)
                    });
                });
                console.log('Data collected from Coincap API.');
                resolve(exchanges);
            } else {
                reject(`Failed to get exchanges from API: ${error}`);
            }
        });
    });
}

/**
 * Calcuates the total volume for the day based on the data that is passed into this functions
 * Expects a cleaned array.
 * @param {*} dataset
 */
function calculateTotalVolume(dataset) {
    var totalVol = 0;
    dataset.forEach(item => {
        if (item.volume > 0) {
            totalVol = totalVol + parseInt(item.volume);
        } else {
            console.log(`Exchange was excluded from volume count ${item.name}`);
        }
    });

    return {
        volume: totalVol,
        date: new Date().setUTCHours(0, 0, 0, 0)
    };
}

function sendEmail(status, message) {
    var transporter = nodemailer.createTransport(emailConfig.transport);
    var mailOptions = {
        from: emailConfig.options.from,
        to: emailConfig.options.to,
        subject: `Crypto Exchange Volumes - ${status}`,
        text: message
    };

    console.log('Sending mail');
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

/**
 * Async function that calls each part of this files functionality in order and awaits for
 * response.
 */
async function getData() {
    // Data fetch and handling
    let exchangeData;
    try {
        exchangeData = await getExchangeDataFromApi();
    } catch (err) {
        sendEmail('Failed at API', err);
    }

    let totalVolume = calculateTotalVolume(exchangeData);

    // Database inserts
    try {
        await db.connectToDatabase();
    } catch (err) {
        sendEmail('Failed at Database', err);
    }

    db.addvolumes(exchangeData);
    db.addTotalVolumes(totalVolume);

    setTimeout(function() {
        db.closeDatabase();
        sendEmail('Success', 'No issues found.');
    }, 5000);
}

getData();

/**
 * TODO
 * - In the reporting state if only a certain exchange was not completed.
 * - Correctly show legend for each exchange
 * - Calculate total volume in bitcoin
 * - Show total volume in terms of total crypto market cap
 * - Show total crypto market cap
 */
