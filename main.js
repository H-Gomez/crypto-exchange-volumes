const request = require('request');
const cheerio = require('cheerio');

const baseUrl = 'https://coinmarketcap.com/exchanges/volume/24-hour/';
const volumesArray = [];

request(baseUrl, (error, response, body) => {
    if (!error) {
        const $ = cheerio.load(body);
        const tableRows = $('.table-condensed tbody tr')
        var exchangeName;

        tableRows.each(function(index, element) {
            if (element.attribs.id) {
                var aa = $(element).nextUntil('tr').attr('id');
                var correctElement = tableRows[index - 1];
                if (correctElement) {
                    var volumeValue = $(correctElement).find('.volume').text();
                    volumeValue = sanitiseStringToNumber(volumeValue);
                    volumesArray.push({ 
                        'name': exchangeName,
                        'volume': volumeValue,
                        'timestamp': Date.now() 
                    })
                } else {
                    console.log('Issue with element: ' + element);
                }
                exchangeName = element.attribs.id;
            }
        });

        console.log(volumesArray);

    } else {
        console.log(`Unable to complete the request: ${error}`);
    }
});

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