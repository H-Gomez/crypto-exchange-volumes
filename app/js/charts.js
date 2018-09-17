module.exports = {
    /**
     * Filters the JSON data from the database to make it ready for charting.
     * Creates a new array which volume values seperated by exchange.
     * @returns {array} filteredData
     */
    filterDataset: function(data) {
        const exchanges = ['binance','bitfinex','okex','huobi','bittrex', 'poloniex', 'cryptopia', 'bittrex','bitstamp', 'kraken', 'coinbase-pro', 'bithumb', 'simex', 'digifinex', 'zb-com', 'bibox', 'bit-z'];
        const chartSeries = [];

        exchanges.forEach(function(exchange) {
            const tradeVolumes = [];

            // Get trade volumes for the current exchange from the total dataset
            let filteredArray = data.filter(function(item) {
                return item.name === exchange;
            });
            
            // Remove uneeded collumns from the filtered dataset into new array.
            filteredArray.forEach(function(item) {
                if (item.volume) {
                    let arr = [];
                    arr.push(item.timestamp);
                    arr.push(item.volume);
                    tradeVolumes.push(arr);
                } else {
                    console.log('The volume property is missing from the dataset');
                }
            });

            // Create new object for the respective exchange to be used in HighCharts
            let exchangeObject = {};
            exchangeObject.name = exchange;
            exchangeObject.data = tradeVolumes;
            exchangeObject.tooltip = {
                valueDecimals: 2
            };

            chartSeries.push(exchangeObject);
        });
        
        return chartSeries;
    }
};
