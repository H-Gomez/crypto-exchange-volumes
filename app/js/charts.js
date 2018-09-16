module.exports = {
    /**
     * Filters the JSON data from the database to make it ready for charting.
     * Creates a new array which volume values seperated by exchange.
     * @returns {array} filteredData
     */
    filterDataset: function(data) {
        const exchanges = ['bitfinex', 'bitstamp'];
        const filteredData = [];

        exchanges.forEach(function(exchange) {
            let newArray = data.filter(function(item) {
                return item.name === exchange;
            });
            
            newArray.forEach(function(item) {
                let arr = [];
                arr.push(item.timestamp);
                arr.push(item.volume);
                filteredData.push(arr);
            });
        });
        
        return filteredData;
    }
};
