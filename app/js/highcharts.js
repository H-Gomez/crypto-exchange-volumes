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
            colors: [
                "#8e92f9",
                "#5a67b9",
                "#C4ADFF",
                "#9291EB",
                "#A0B7FF",
                "#7f5ab9",
                "#E46151",
                "#f77474",
                "#da415d",
                "#e7adff"
            ],
            yAxis: {
                labels:{
                    align:'left',
                    x: 20,
                    y: 5,
                    style: {
                        color: '#bec2cf'
                    },
                    formatter: function() {
                        return this.value+"%";
                    },
                },
                lineWidth: 0,
                offset: 10
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: {
                        color: '#bec2cf'
                    }
                }
            },
            legend: {
                enabled: true
            },
            exporting: { enabled: false }
        });
    }

    function buildVolumeChart(db) {
        Highcharts.theme = {
            // "colors": [
            //     "#41B5E9",
            //     "#FA8832",
            //     "#34393C",
            //     "#E46151"
            // ],
            "chart": {
                "style": {
                    "color": "#333",
                    "fontFamily": "Open Sans",
                    "backgroundColor": "#f3f6fc"
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
                "align": "left",
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
                "gridLineColor": "#e0e3e8",
                "lineColor": "#000000",
                "minorGridLineColor": "#000000",
                "tickColor": "#bec2cf",
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
                enabled: false,
                floating: false
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
                    data: db,
                    color: '#8e92f9'
                }
            ],
            scrollbar: {
                enabled: false
            },
            yAxis: {
                labels:{
                    align:'left',
                    x: 20,
                    y: 5,
                    style: {
                        color: '#bec2cf'
                    }
                },
                lineWidth: 0,
                offset: 10
            },
            xAxis: {
                type: 'datetime',
                labels:{
                    style: {
                        color: '#bec2cf'
                    }
                }
            }
        });
    }
});
