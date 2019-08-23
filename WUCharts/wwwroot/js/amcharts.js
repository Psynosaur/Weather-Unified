// amCharts JS

// am4core.useTheme(am4themes_animated);
am4core.options.minPolylineStep = 5;
am4core.useTheme(am4themes_dark);
// We set our data to the model with reduced data points
var data = modeldata;
var h = hrs;

// Create temp chart instance
var temp = am4core.create("chartemp", am4charts.XYChart);
temp.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelTemp = temp.chartContainer.createChild(am4core.Label);
labelTemp.text = "Temp °C";
labelTemp.align = "center";

// Create TminMax chart instance
var tminmax = am4core.create("chartminmax", am4charts.XYChart);
tminmax.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelTemp = tminmax.chartContainer.createChild(am4core.Label);
labelTemp.text = "Temp Min/Max °C";
labelTemp.align = "center";

// Create humidity chart instance
var hum = am4core.create("charthum", am4charts.XYChart);
hum.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelHum = hum.chartContainer.createChild(am4core.Label);
labelHum.text = "Humidity %";
labelHum.align = "center";

// Create wind chart instance
var wind = am4core.create("chartwind", am4charts.XYChart);
wind.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
wind.numberFormatter.numberFormat
var labelWind = wind.chartContainer.createChild(am4core.Label);
labelWind.text = "Wind Speed ";
labelWind.align = "center";

// Create rain chart instance
var rain = am4core.create("chartrain", am4charts.XYChart);
rain.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelRain = rain.chartContainer.createChild(am4core.Label);
labelRain.text = "Rain";
labelRain.align = "center";

// Create pressure chart instance
var pressure = am4core.create("chartpressure", am4charts.XYChart);
pressure.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelPressure = pressure.chartContainer.createChild(am4core.Label);
labelPressure.text = "Pressure";
labelPressure.align = "center";

// Create Solar chart instance
var solar = am4core.create("chartsolar", am4charts.XYChart);
solar.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
var labelSolar = solar.chartContainer.createChild(am4core.Label);
labelSolar.text = "Radiation Watts/m²";
labelSolar.align = "center";

// Add data
temp.data = data;
wind.data = data;
hum.data = data;
rain.data = data;
tminmax.data = data;
pressure.data = data;
solar.data = data;

// Create temp axes
var categoryAxisTemp = temp.xAxes.push(new am4charts.DateAxis());
categoryAxisTemp.renderer.grid.template.location = 0;
categoryAxisTemp.renderer.minGridDistance = 60;
categoryAxisTemp.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisTemp.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisTemp.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisTemp.baseInterval = {
            "timeUnit": "minute",
            "count" : 30
        };
        categoryAxisTemp.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisTemp.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisTemp.dateFormats.setKey("second", "HH:mm");
}
var valueAxisTemp = temp.yAxes.push(new am4charts.ValueAxis());

// Create tMinMax axes
var categoryAxisTminmax = tminmax.xAxes.push(new am4charts.DateAxis());
categoryAxisTminmax.renderer.grid.template.location = 0;
categoryAxisTminmax.renderer.minGridDistance = 60;
categoryAxisTminmax.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisTminmax.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisTminmax.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisTminmax.baseInterval = {
            "timeUnit": "minute",
            "count" : 15
        };
        categoryAxisTminmax.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisTminmax.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisTminmax.dateFormats.setKey("second", "HH:mm");
}
var valueAxisTminmax = tminmax.yAxes.push(new am4charts.ValueAxis());

// Create hum axes
var categoryAxisHum = hum.xAxes.push(new am4charts.DateAxis());
categoryAxisHum.renderer.grid.template.location = 0;
categoryAxisHum.renderer.minGridDistance = 60;
categoryAxisHum.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisHum.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisHum.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisHum.baseInterval = {
            "timeUnit": "minute",
            "count" : 30
        };
        categoryAxisHum.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisHum.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisHum.dateFormats.setKey("second", "HH:mm");
}
var valueAxisHum = hum.yAxes.push(new am4charts.ValueAxis());

// Create wind axes
var categoryAxisWind = wind.xAxes.push(new am4charts.DateAxis());
categoryAxisWind.renderer.grid.template.location = 0;
categoryAxisWind.renderer.minGridDistance = 60;

switch(h) {
    case 1:
        categoryAxisWind.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisWind.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisWind.baseInterval = {
            "timeUnit": "minute",
            "count" : 15
        };
        categoryAxisWind.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisWind.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisWind.dateFormats.setKey("second", "HH:mm");
}
var valueAxisWind = wind.yAxes.push(new am4charts.ValueAxis());


// Create rain axes
var categoryAxisRain = rain.xAxes.push(new am4charts.DateAxis());
categoryAxisRain.renderer.grid.template.location = 0;
categoryAxisRain.renderer.minGridDistance = 60;
categoryAxisRain.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisRain.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisRain.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisRain.baseInterval = {
            "timeUnit": "minute",
            "count" : 15
        };
        categoryAxisRain.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisRain.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisRain.dateFormats.setKey("second", "HH:mm");
}
var valueAxisRain = rain.yAxes.push(new am4charts.ValueAxis());

// Create pressure axes
var categoryAxisPressure = pressure.xAxes.push(new am4charts.DateAxis());
categoryAxisPressure.renderer.grid.template.location = 0;
categoryAxisPressure.renderer.minGridDistance = 60;
categoryAxisPressure.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisPressure.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisPressure.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisPressure.baseInterval = {
            "timeUnit": "minute",
            "count" : 15
        };
        categoryAxisPressure.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisPressure.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisPressure.dateFormats.setKey("second", "HH:mm");
}
var valueAxisPressure = pressure.yAxes.push(new am4charts.ValueAxis());

var categoryAxisSolar = solar.xAxes.push(new am4charts.DateAxis());
categoryAxisSolar.renderer.grid.template.location = 0;
categoryAxisSolar.renderer.minGridDistance = 60;
categoryAxisSolar.baseInterval = {
    "timeUnit": "minute"
};
switch(h) {
    case 1:
        categoryAxisSolar.baseInterval = {
            "timeUnit": "minute"
        };
        categoryAxisSolar.dateFormats.setKey("minute", "HH:mm");
        break;
    case 2:
        categoryAxisSolar.baseInterval = {
            "timeUnit": "minute",
            "count" : 30
        };
        categoryAxisSolar.dateFormats.setKey("minute", "dd-MM HH:mm");
        break;
    default:
        categoryAxisSolar.baseInterval = {
            "timeUnit": "second",
            "count" : 15
        };
        categoryAxisSolar.dateFormats.setKey("second", "HH:mm");
}
var valueAxisSolar = solar.yAxes.push(new am4charts.ValueAxis());

// Create temp series
var seriesTemp = temp.series.push(new am4charts.LineSeries());
seriesTemp.dataFields.valueY = "TempOutCur";
seriesTemp.dataFields.dateX = "DateTime";
seriesTemp.tooltipText = "{TempOutCur} °C";
seriesTemp.strokeWidth = 1;
seriesTemp.stroke = am4core.color("#ff8145");
seriesTemp.tooltip.getFillFromObject = false;
seriesTemp.tooltip.background.fill = am4core.color("#ff8145");
seriesTemp.tooltip.label.fill = am4core.color("#000");
// seriesTemp.heatRules.push({
//     "target": seriesTemp.lines.template,
//     "property": "stroke",
//     "min": am4core.color("#F5DBCB"),
//     "max": am4core.color("#ED7B84"),
//     "dataField": "valueY"
// });
// seriesTemp.tensionY = 1;
// seriesTemp.tensionX = 0.8;
var seriesTempDeW = temp.series.push(new am4charts.LineSeries());
seriesTempDeW.dataFields.valueY = "DewCur";
seriesTempDeW.dataFields.dateX = "DateTime";
seriesTempDeW.tooltipText = "Dew Point {DewCur} °C";
seriesTempDeW.strokeWidth = 1;
seriesTempDeW.stroke = am4core.color("#87f7ff");
seriesTempDeW.tooltip.getFillFromObject = false;
seriesTempDeW.tooltip.background.fill = am4core.color("#87f7ff");
seriesTempDeW.tooltip.label.fill = am4core.color("#000");
// seriesTempDeW.tensionY = 1;
// seriesTempDeW.tensionX = 0.8;
// temp.scrollbarX = new am4core.Scrollbar();
temp.cursor = new am4charts.XYCursor();

// Create tMinMax series
var seriesTempMin = tminmax.series.push(new am4charts.LineSeries());
seriesTempMin.dataFields.valueY = "Tmin";
seriesTempMin.dataFields.dateX = "DateTime";
seriesTempMin.tooltipText = "{Tmin} °C min";
seriesTempMin.strokeWidth = 1;
seriesTempMin.stroke = am4core.color("#0ec7ff");
seriesTempMin.tooltip.getFillFromObject = false;
seriesTempMin.tooltip.background.fill = am4core.color("#0ec7ff");
seriesTempMin.tooltip.label.fill = am4core.color("#000");
// seriesTempMin.tensionY = 1;
// seriesTempMin.tensionX = 0.8;
var seriesTempMax = tminmax.series.push(new am4charts.LineSeries());
seriesTempMax.dataFields.valueY = "Tmax";
seriesTempMax.dataFields.dateX = "DateTime";
seriesTempMax.tooltipText = "{Tmax} °C max";
seriesTempMax.strokeWidth = 1;
seriesTempMax.stroke = am4core.color("#ff2955");
seriesTempMax.tooltip.getFillFromObject = false;
seriesTempMax.tooltip.background.fill = am4core.color("#ff2955");
seriesTempMax.tooltip.label.fill = am4core.color("#000");
// seriesTempMax.tensionY = 1;
// seriesTempMax.tensionX = 0.8;
// tminmax.scrollbarX = new am4core.Scrollbar();
tminmax.cursor = new am4charts.XYCursor();

// Create Hum series
var seriesHum = hum.series.push(new am4charts.LineSeries());
seriesHum.dataFields.valueY = "HumOutCur";
seriesHum.dataFields.dateX = "DateTime";
seriesHum.tooltipText = "{HumOutCur} %";
seriesHum.strokeWidth = 1;
seriesHum.stroke = am4core.color("#5c8fff");
seriesHum.tooltip.getFillFromObject = false;
seriesHum.tooltip.background.fill = am4core.color("#5c8fff");
seriesHum.tooltip.label.fill = am4core.color("#000");
// seriesTempMax.tensionY = 1;
// seriesTempMax.tensionX = 0.8;
// tminmax.scrollbarX = new am4core.Scrollbar();
hum.cursor = new am4charts.XYCursor();

// Create wind series
var seriesWind = wind.series.push(new am4charts.LineSeries());
seriesWind.dataFields.valueY = "WindSpeedCur";
seriesWind.dataFields.dateX = "DateTime";
seriesWind.tooltipText = "{WindSpeedCur} m/s";
seriesWind.strokeWidth = 1;
seriesWind.stroke = am4core.color("#11ff1e");
seriesWind.tooltip.getFillFromObject = false;
seriesWind.tooltip.background.fill = am4core.color("#11ff1e");
seriesWind.tooltip.label.fill = am4core.color("#000");
// seriesWind.tensionY = 1;
// seriesWind.tensionX = 0.8;
var seriesWindGust = wind.series.push(new am4charts.LineSeries());
seriesWindGust.dataFields.valueY = "WindGust10";
seriesWindGust.dataFields.dateX = "DateTime";
seriesWindGust.tooltipText = "{WindGust10} m/s";
seriesWindGust.strokeWidth = 1;
seriesWindGust.stroke = am4core.color("#ffbf8d");
seriesWindGust.tooltip.getFillFromObject = false;
seriesWindGust.tooltip.background.fill = am4core.color("#ffbf8d");
seriesWindGust.tooltip.label.fill = am4core.color("#000");
// seriesWindGust.tensionY = 1;
// seriesWindGust.tensionX = 0.8;
// wind.scrollbarX = new am4core.Scrollbar();
wind.cursor = new am4charts.XYCursor();

// Create rain series
var seriesRain = rain.series.push(new am4charts.LineSeries());
seriesRain.dataFields.valueY = "RainDay";
seriesRain.dataFields.dateX = "DateTime";
seriesRain.tooltipText = "{RainDay} mm";
seriesRain.strokeWidth = 1;
// seriesRain.tensionY = 1;
// seriesRain.tensionX = 0.8;
var seriesRainRate = rain.series.push(new am4charts.LineSeries());
seriesRainRate.dataFields.valueY = "RainRateCur";
seriesRainRate.dataFields.dateX = "DateTime";
seriesRainRate.tooltipText = "{RainRateCur} mm/h";
seriesRainRate.strokeWidth = 1;
// seriesRainRate.tensionY = 1;
// seriesRainRate.tensionX = 0.8;
// rain.scrollbarX = new am4core.Scrollbar();
rain.cursor = new am4charts.XYCursor();

// Create pressure series
var seriesPressure = pressure.series.push(new am4charts.LineSeries());
seriesPressure.dataFields.valueY = "PressCur";
seriesPressure.dataFields.dateX = "DateTime";
seriesPressure.tooltipText = "{PressCur} hPa";
seriesPressure.strokeWidth = 1;
// seriesPressure.tensionY = 1;
// seriesPressure.tensionX = 0.8;
// pressure.scrollbarX = new am4core.Scrollbar();
pressure.cursor = new am4charts.XYCursor();

// Create solar series
var seriesSolar = solar.series.push(new am4charts.LineSeries());
seriesSolar.dataFields.valueY = "SolarRad";
seriesSolar.dataFields.dateX = "DateTime";
seriesSolar.tooltipText = "{SolarRad} W/m²";
seriesSolar.strokeWidth = 1;
seriesSolar.stroke = am4core.color("#ffdf43");
seriesSolar.tooltip.getFillFromObject = false;
seriesSolar.tooltip.background.fill = am4core.color("#ffdf43");
seriesSolar.tooltip.label.fill = am4core.color("#000");
// seriesPressure.tensionY = 1;
// seriesPressure.tensionX = 0.8;
// pressure.scrollbarX = new am4core.Scrollbar();
solar.cursor = new am4charts.XYCursor();