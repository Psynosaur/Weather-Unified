// amCharts JS
am4core.ready(function() {
    // am4core.useTheme(am4themes_animated);
    am4core.options.minPolylineStep = 5;
    am4core.options.queue = true;
    am4core.useTheme(am4themes_dark);
    // We set our data to the model with reduced data points
    var raindat = raindata;
    
    var rainrose = am4core.create("rainrose", am4charts.RadarChart);
    // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "WindDirCurEng";
    /* Create axes */
    var xAxisRR = rainrose.xAxes.push(new am4charts.ValueAxis());
    xAxisRR.renderer.maxLabelPosition = 0.99;
    xAxisRR.min = 0;
    xAxisRR.max = 360;
    xAxisRR.renderer.minGridDistance = 40;
    xAxisRR.strictMinMax = true;
    xAxisRR.dateFormatter = new am4core.DateFormatter();
    xAxisRR.dateFormatter.dateFormat = "HH:mm";
    // var categoryAxisWR = windrose.xAxes.push(new am4charts.DateAxis());
    // categoryAxisWR.tooltipDateFormat = "HH:mm";
    // xAxis.numberFormatter.numberFormat = "#.0°|0°";


    var yAxisRR = rainrose.yAxes.push(new am4charts.ValueAxis());
    yAxisRR.renderer.labels.disabled = true;
    // yAxis.renderer.labels.template.verticalCenter = "bottom";
    // yAxis.renderer.labels.template.horizontalCenter = "right";
    // yAxis.renderer.maxLabelPosition = 01;
    // yAxis.renderer.labels.template.paddingBottom = 1;
    // yAxis.renderer.labels.template.paddingRight = 3;
    // yAxis.renderer.minGridDistance = 20;


    /* Create and configure series */
    var rainRate = rainrose.series.push(new am4charts.RadarSeries());
    var circleBulletRR = rainRate.bullets.push(new am4core.Circle());
    circleBulletRR.tooltipText = "{ObsTime} : {RainRateCur} mm/h from {WindDirAvg10}°";
    circleBulletRR.radius = 3;
    circleBulletRR.strokeWidth = 1;
    // rainRate.minBulletDistance = 1.5;
    rainRate.strokeOpacity = 0;
    rainRate.dataFields.valueX = "WindDirAvg10";
    rainRate.dataFields.valueY = "RainRateCur";
    rainRate.name = "Rain Rate";
    // rainRate.sequencedInterpolation = true;
    // rainRate.sequencedInterpolationDelay = 10;
    rainRate.data = raindat;
    rainRate.fill = am4core.color("#43fff9");






    /* Add legend */
    // rainrose.legend = new am4charts.Legend();
});