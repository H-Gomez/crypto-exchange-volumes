module.exports = {
    /**
     * Filters the JSON data from the database to make it ready for charting.
     * Creates a new array which volume values seperated by exchange.
     * @param {array} data - The dataset to be filtered
     * @returns {array} chartSeries
     */
    filterDataset: function(data) {
        const exchanges = [
            'bithumb',
            'binance',
            'okex',
            'huobi',
            'zb',
            'hitbtc',
            'bibox',
            'lbank',
            'bitfinex',
            'ooobtc',
            'coinegg',
            'qryptos',
            'quoine',
            'coinbene',
            'gdax',
            'allcoin',
            'bit-z',
            'kraken',
            'bitbank',
            'bitstamp',
            'coinex',
            'sistemkoin',
            'bittrex',
            'btcbox',
            'exmo',
            'gate',
            'bitflyer',
            'bitbay',
            'yobit',
            'gemini',
            'livecoin',
            'kucoin',
            'bigone',
            'itbit',
            'poloniex',
            'coinone',
            'zaif',
            'korbit',
            'cex',
            'lakebtc',
            'cryptopia',
            'tidex',
            'okcoin',
            'luno',
            'btcturk',
            'independentreserve',
            'idex',
            'btcc',
            'bxinth',
            'coinfloor',
            'acx',
            'bitso',
            'btcmarket',
            'quadrigacx',
            'bleutrade',
            'coinexchange',
            'tradesatoshi',
            'coinmate',
            'wex',
            'mercado',
            'bitmarket',
            'therocktrading',
            'lykke',
            'kuna',
            'braziliex',
            'btctradeua',
            'coinnest',
            'gatecoin',
            'xbtce'
        ];

        const chartSeries = [];

        exchanges.forEach(function(exchange) {
            const tradeVolumes = [];

            // Get trade volumes for the current exchange from the total dataset
            let filteredArray = data.filter(function(item) {
                return item.exchangeId === exchange;
            });

            // Remove uneeded collumns from the filtered dataset into new array.
            filteredArray.forEach(function(item) {
                if (item.volume) {
                    let arr = [];
                    arr.push(item.date);
                    arr.push(item.volume);
                    tradeVolumes.push(arr);
                } else {
                    console.log(
                        `The volume property is missing from the dataset: ${item.name}`
                    );
                }
            });

            //sort array
            tradeVolumes.sort(function(a, b) {
                return a[0] - b[0];
            });

            // Create new object for the respective exchange to be used in HighCharts
            let exchangeObject = {};
            exchangeObject.name = exchange;
            exchangeObject.data = tradeVolumes;
            exchangeObject.type = 'area';
            exchangeObject.tooltip = {
                valueDecimals: 2
            };

            chartSeries.push(exchangeObject);
        });

        return chartSeries;
    }
};
