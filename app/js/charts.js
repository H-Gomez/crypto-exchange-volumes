module.exports = {
    filterDataset: function(data) {
        let exchange = 'bitstamp';
        let newArray = data.filter(function(item) {
            return item.name === exchange;
        });
    
        return newArray;
    }
};
