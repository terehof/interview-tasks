var app = app || {};

app.main = {
    chart: {},
    xVal: '',
    getData: function () {
        var self = this;
        $.ajax({
            url: '/api/v1/config',
            type: 'GET',
            success: function (data) {
                self.parseAnswer(data);
            }
        });
    },
    parseAnswer: function (config) {
        var self = this;
        app.options.interval = config.POINTS.UPDATE_INTERVAL;
        app.options.min = config.POINTS.MIN;
        app.options.max = config.POINTS.MAX;
        app.options.qty = config.POINTS.QTY;
        self.xVal = config.POINTS.QTY;
        $.ajax({
            url: '/api/v1/points',
            type: 'GET',
            success: function (data) {
                app.options.startData = data;
                self.drawChart();
            }
        });
    },
    drawChart: function () {
        var self = this,
            startData = app.options.startData;
        for (var i = 0; i < startData.length; i++) {
            app.options.dataPoints.push({
                x: i,
                y: startData[i]
            })
        }
        self.chart = new CanvasJS.Chart("container", {
            title:{
                text: "Hexagon Technologies"
            },
            toolTip: {
                enabled: false
            },
            axisY:{
                minimum: app.options.min,
                maximum: app.options.max
            },
            axisX: {
                labelFontColor: '#fff'
            },
            data: [
                {
                    type: "line",
                    dataPoints: app.options.dataPoints
                }
            ]
        });
        self.chart.render();
        setInterval(function () {
            $.ajax({
                url: '/api/v1/points',
                type: 'GET',
                success: function (data) {
                    self.updateChart(data);
                }
            });
        }, app.options.interval)
    },
    updateChart: function (data) {
        var self = this;
        self.count = self.count || 1;
        for (var j = 0; j < self.count; j++) {
            self.yVal = data[data.length-1];
            app.options.dataPoints.push({
                x: self.xVal,
                y: self.yVal
            });
            self.xVal++;
        }
        if (app.options.dataPoints.length > app.options.qty) {
            app.options.dataPoints.shift();
        }
        self.chart.render();
    },
    init: function () {
        this.getData();
    }
};

app.bonus = {
    chart: [],
    xVal: '',
    options: {
        dataPoints: []
    },
    getConfig: function () {
        var self = this;
        $.ajax({
            url: '/api/v2/config',
            type: 'GET',
            success: function (data) {
                self.parseConfig(data);
            }
        });
    },
    parseConfig: function (config) {
        var self = this;
        self.options.interval = config.POINTS.UPDATE_INTERVAL;
        self.options.min = config.POINTS.MIN;
        self.options.max = config.POINTS.MAX;
        self.options.qty = config.POINTS.QTY;
        self.xVal = config.POINTS.QTY;
        self.getStartData();
    },
    getStartData: function () {
        var self = this;
        $.when( $.ajax('/api/v2/points'), $.ajax('/api/v3/points'), $.ajax('/api/v4/points') ).done(function(data1, data2, data3 ) {
            self.options.startData = [data1, data2, data3];
            self.drawCharts();
        });
    },
    drawCharts: function() {
        var self = this,
            startData = self.options.startData;

        for (var i = 0; i < startData.length; i++) {
            self.options.dataPoints.push([]);
            for (var j = 0; j < startData[i][0].length; j++) {
                self.options.dataPoints[i].push({
                    x: j,
                    y: startData[i][0][j]
                })
            }
            self.chart[i] = new CanvasJS.Chart('container-bonus-'+(i+1), {
                title:{
                    text: 'Bonus chart ' + (i + 1)
                },
                toolTip: {
                    enabled: false
                },
                axisY:{
                    minimum: self.options.min,
                    maximum: self.options.max
                },
                axisX: {
                    labelFontColor: '#fff'
                },
                data: [
                    {
                        type: "line",
                        dataPoints: self.options.dataPoints[i]
                    }
                ]
            });
            self.chart[i].render();
        }
        setInterval(function () {
            $.when( $.ajax('/api/v2/points'), $.ajax('/api/v3/points'), $.ajax('/api/v4/points') ).done(function(data1, data2, data3 ) {
                self.options.data = [data1, data2, data3];
                self.updateCharts();
            });
        }, self.options.interval);

    },
    updateCharts: function () {
        var self = this;

        for (var i = 0; i < self.options.data.length; i++) {
            self.count = self.count || 1;
            for (var j = 0; j < self.count; j++) {
                self.yVal = self.options.data[i][0][self.options.data[i].length-1];
                self.options.dataPoints[i].push({
                    x: self.xVal,
                    y: self.yVal
                });
                self.xVal++;
            }
            if (self.options.dataPoints[i].length > self.options.qty) {
                self.options.dataPoints[i].shift();
            }
            self.chart[i].render();
        }


    },

    init: function () {
        this.getConfig();
    }
};

app.chartSvg = {
    getData: function () {
        var self = this;
        $.ajax({
            url: '/api/v1/config',
            type: 'GET',
            success: function (data) {
                self.parseAnswer(data);
            }
        });
    },
    parseAnswer: function (config) {
        var self = this;
        app.options.interval = config.POINTS.UPDATE_INTERVAL;
        app.options.min = config.POINTS.MIN;
        app.options.max = config.POINTS.MAX;
        $.ajax({
            url: '/api/v1/points',
            type: 'GET',
            success: function (data) {
                app.options.startData = data;
                self.drawChart();
            }
        });
    },
    drawChart: function () {
        var self = this;
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
        $('#container-svg').highcharts({
            chart: {
                type: 'spline',
                marginRight: 10,
                events: {
                    load: function () {
                        var series = this.series[0],
                            lastX = series.xData[series.xData.length -1];
                        setInterval(function () {
                            $.ajax({
                                url: '/api/v1/points',
                                type: 'GET',
                                success: function (data) {
                                    var x = lastX++,
                                        y = data[data.length-1];
                                    series.addPoint([x, y], true, true);
                                }
                            });
                        }, app.options.interval);
                    }
                }
            },
            title: {
                text: 'Hexagon Technologies'
            },
            subtitle: {
                text: 'Interview task'
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            xAxis: {
                title: {
                    text: 'X-axis'
                },
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Y-axis'
                },
                min: app.options.min,
                max: app.options.max
            },
            series: [{
                name: 'Random data',
                data: (function () {
                    var startData = app.options.startData,
                        data = [], i;
                    for (i = 0; i < startData.length; i++) {
                        data.push({
                            x: i,
                            y: startData[i]
                        });
                    }
                    return data;
                }())
            }],
            plotOptions: {
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    marker: {
                        enabled: false
                    }
                },
                line: {
                    animation: true
                }
            }
        });
    },

    init: function () {
        this.getData();
    }
};

app.options = {
    qty: '',
    dataPoints: [],
    startData: '',
    min: '',
    max: '',
    interval: ''
};

$(function () {
    if ($('#container-svg').length > 0) {
        app.chartSvg.init();
    } else if ($('#container-bonus-1').length > 0) {
        app.bonus.init();
    } else {
        app.main.init();
    }
});






