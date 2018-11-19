jQuery(document).ready(function($) {
    $.ajax({
        datatype: 'json',
        url: 'http://localhost:3000/charts/all'
    })
        .done(function(response) {
            buildCharts(response);
        })
        .fail(function() {
            console.log('Ajax failed to get chart data');
        });

    $.ajax({
        datatype: 'json',
        url: 'http://localhost:3000/volumes/total'
    })
        .done(function(response) {
            buildVolumeChart(response);
        })
        .fail(function() {
            console.log('Ajax failed to get volume data');
        });

    // Move to repsective file
    function buildCharts(chartData) {
        Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 1
            },
            plotOptions: {
                area: {
                    stacking: 'percent'
                }
            },
            series: chartData,
            yAxis: {
                offset: 20
            },
            xAxis: {
                type: 'datetime'
            },
            legend: {
                enabled: true
            },
            exporting: { enabled: false }
        });
    }

    function buildVolumeChart(db) {
        Highcharts.setOptions({
            lang: {numericSymbols: [ 'K' , 'M' , 'B' , 'T' , 'P' , 'E'] }
        });
        Highcharts.stockChart('total-volumes', {
            chart: {
                type: 'column'
            },
            exporting: { 
                enabled: false 
            },
            legend: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillOpacity: 0.2
                }
            },
            rangeSelector: {
                enabled: false
            },
            series: [{ 
                data: db 
            }],
            yAxis: {
                offset: 20
            },
            xAxis: {
                type: 'datetime'
            }
        });
    }
});
