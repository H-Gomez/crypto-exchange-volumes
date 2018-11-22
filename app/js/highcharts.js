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
        Highcharts.theme = {
            "colors": [
                "#41B5E9",
                "#FA8832",
                "#34393C",
                "#E46151"
            ],
            "chart": {
                "style": {
                "color": "#333",
                "fontFamily": "Open Sans"
                }
            },
            "title": {
                "style": {
                "fontFamily": "Raleway",
                "fontWeight": "100"
                }
            },
            "subtitle": {
                "style": {
                "fontFamily": "Raleway",
                "fontWeight": "100"
                }
            },
            "legend": {
                "align": "right",
                "verticalAlign": "bottom"
            },
            "xAxis": {
                "gridLineWidth": 0,
                "gridLineColor": "#F3F3F3",
                "lineColor": "#F3F3F3",
                "minorGridLineColor": "#F3F3F3",
                "tickColor": "#F3F3F3",
                "tickWidth": 1
            },
            "yAxis": {
                "gridLineDashStyle": "dash",
                "gridLineColor": "#F3F3F3",
                "lineColor": "#F3F3F3",
                "minorGridLineColor": "#F3F3F3",
                "tickColor": "#F3F3F3",
                "tickWidth": 1
            },
            "lang": { 
                "numericSymbols": ['K', 'M', 'B', 'T', 'P', 'E'] 
            }
        };
        
        Highcharts.setOptions(Highcharts.theme);

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
            series: [
                {
                    data: db
                }
            ],
            scrollbar: {
                enabled: false
            },
            yAxis: {
                offset: 20
            },
            xAxis: {
                type: 'datetime'
            }
        });
    }
});
