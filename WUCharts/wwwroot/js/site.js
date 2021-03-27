// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    // Check if there are any navbar burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(el => {
            el.addEventListener('click', () => {

                // Get the target from the "data-target" attribute
                const target = el.dataset.target;
                const $target = document.getElementById(target);

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');

            });
        });
    }

});

// amCharts JS
am4core.ready(function () {
    // am4core.useTheme(am4themes_animated);
    am4core.options.minPolylineStep = 5;
    // am4core.options.queue = true;
    am4core.useTheme(am4themes_dark);
    // We set our data to the model with reduced data points
    
    var h = hrs;
    if (h <= 2) {
        var raindat = raindata;
        var winddat = winddata;
        var objdat = objdata;
        // Create temp chart instance
        var temp = am4core.create("chartemp", am4charts.XYChart);
        temp.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelTemp = temp.chartContainer.createChild(am4core.Label);
        labelTemp.text = "Outdoor Temp";
        labelTemp.align = "center";
        // temp.exporting.menu = new am4core.ExportMenu();
        // temp.exporting.menu.align = "left";
        // temp.exporting.menu.verticalAlign = "top";

        // Create TminMax chart instance
        var tminmax = am4core.create("chartminmax", am4charts.XYChart);
        tminmax.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelTminmax = tminmax.chartContainer.createChild(am4core.Label);
        labelTminmax.text = "Outdoor Temp Min/Max";
        labelTminmax.align = "center";

        // Create humidity chart instance
        var hum = am4core.create("charthum", am4charts.XYChart);
        hum.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelHum = hum.chartContainer.createChild(am4core.Label);
        labelHum.text = "Outdoor & Indoor Humidity";
        labelHum.align = "center";

        // Create wind chart instance
        var wind = am4core.create("chartwind", am4charts.XYChart);
        wind.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        wind.numberFormatter.numberFormat
        var labelWind = wind.chartContainer.createChild(am4core.Label);
        labelWind.text = "Wind Speed";
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
        labelPressure.text = "Indoor Pressure";
        labelPressure.align = "center";

        // Create Solar chart instance
        var solar = am4core.create("chartsolar", am4charts.XYChart);
        solar.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelSolar = solar.chartContainer.createChild(am4core.Label);
        labelSolar.text = "Radiation";
        labelSolar.align = "center";

        // Create UV chart instance
        var uv = am4core.create("chartuv", am4charts.XYChart);
        uv.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelUV = uv.chartContainer.createChild(am4core.Label);
        labelUV.text = "UV index";
        labelUV.align = "center";

        // Create winddir chart instance
        var wd = am4core.create("chartwd", am4charts.XYChart);
        wd.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelWD = wd.chartContainer.createChild(am4core.Label);
        labelWD.text = "Wind Direction";
        labelWD.align = "center";
        // var labelWD2 = wd.yAxes.push(new am4charts.ValueAxis());
        // labelWD2.title.text = "N";
        // labelWD2.renderer.opposite = true;

        // Add data
        temp.data = objdat;
        wind.data = objdat;
        hum.data = objdat;
        rain.data = objdat;
        tminmax.data = objdat;
        pressure.data = objdat;
        solar.data = objdat;
        uv.data = objdat;
        wd.data = objdat;

        // Create temp axes
        var categoryAxisTemp = temp.xAxes.push(new am4charts.DateAxis());
        categoryAxisTemp.renderer.grid.template.location = 0;
        categoryAxisTemp.renderer.minGridDistance = 60;
        categoryAxisTemp.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisTemp.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisTemp.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisTemp.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisTemp.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisTemp.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
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
        switch (h) {
            case 1:
                categoryAxisTminmax.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisTminmax.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisTminmax.baseInterval = {
                    "timeUnit": "minute",
                    "count": 15
                };
                categoryAxisTminmax.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisTminmax.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
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
        switch (h) {
            case 1:
                categoryAxisHum.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisHum.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisHum.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisHum.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisHum.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisHum.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisHum = hum.yAxes.push(new am4charts.ValueAxis());

        // Create wind axes
        var categoryAxisWind = wind.xAxes.push(new am4charts.DateAxis());
        categoryAxisWind.renderer.grid.template.location = 0;
        categoryAxisWind.renderer.minGridDistance = 60;

        switch (h) {
            case 1:
                categoryAxisWind.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisWind.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisWind.baseInterval = {
                    "timeUnit": "minute",
                    "count": 15
                };
                categoryAxisWind.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisWind.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisWind.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisWind = wind.yAxes.push(new am4charts.ValueAxis());
        valueAxisWind.min = 0;


        // Create rain axes
        var categoryAxisRain = rain.xAxes.push(new am4charts.DateAxis());
        categoryAxisRain.renderer.grid.template.location = 0;
        categoryAxisRain.renderer.minGridDistance = 60;
        categoryAxisRain.baseInterval = {
            "timeUnit": "minute"
        };

        switch (h) {
            case 1:
                categoryAxisRain.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisRain.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisRain.baseInterval = {
                    "timeUnit": "minute",
                    "count": 15
                };
                categoryAxisRain.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisRain.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisRain.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisRain = rain.yAxes.push(new am4charts.ValueAxis());
        valueAxisRain.min = 0;

        // Create pressure axes
        var categoryAxisPressure = pressure.xAxes.push(new am4charts.DateAxis());
        categoryAxisPressure.renderer.grid.template.location = 0;
        categoryAxisPressure.renderer.minGridDistance = 60;
        categoryAxisPressure.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisPressure.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisPressure.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisPressure.baseInterval = {
                    "timeUnit": "minute",
                    "count": 15
                };
                categoryAxisPressure.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisPressure.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
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
        switch (h) {
            case 1:
                categoryAxisSolar.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisSolar.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisSolar.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisSolar.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisSolar.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisSolar.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisSolar = solar.yAxes.push(new am4charts.ValueAxis());
        valueAxisSolar.min = 0;
        valueAxisSolar.strictMinMax = true;

        // Create UV axes
        var categoryAxisUV = uv.xAxes.push(new am4charts.DateAxis());
        categoryAxisUV.renderer.grid.template.location = 0;
        categoryAxisUV.renderer.minGridDistance = 60;
        categoryAxisUV.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisUV.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisUV.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisUV.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisUV.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisUV.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisUV.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisUV = uv.yAxes.push(new am4charts.ValueAxis());
        valueAxisUV.min = 0;
        valueAxisUV.strictMinMax = true;

        // Create WindDir axes
        var categoryAxisWD = wd.xAxes.push(new am4charts.DateAxis());
        categoryAxisWD.renderer.grid.template.location = 0;
        categoryAxisWD.renderer.minGridDistance = 60;
        categoryAxisWD.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisWD.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisWD.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisWD.baseInterval = {
                    "timeUnit": "minute"
                    // "count" : 30
                };
                categoryAxisWD.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisWD.baseInterval = {
                    "timeUnit": "second"
                    // "count" : 15
                };
                categoryAxisWD.dateFormats.setKey("second", "HH:mm");
        }
        var valueAxisWD = wd.yAxes.push(new am4charts.ValueAxis());
        valueAxisWD.min = 0;
        valueAxisWD.max = 360;
        valueAxisWD.renderer.minGridDistance = 12.3;
        valueAxisWD.strictMinMax = true;

        // Create temp series
        var seriesTemp = temp.series.push(new am4charts.LineSeries());
        seriesTemp.dataFields.valueY = "TempOutCur";
        seriesTemp.dataFields.dateX = "ObsTime";
        seriesTemp.tooltipText = "Outdoor {TempOutCur} °C";
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
        seriesTemp.tensionY = 1;
        seriesTemp.tensionX = 0.8;
        var seriesTempDeW = temp.series.push(new am4charts.LineSeries());
        seriesTempDeW.dataFields.valueY = "DewCur";
        seriesTempDeW.dataFields.dateX = "ObsTime";
        seriesTempDeW.tooltipText = "Dew Point {DewCur} °C";
        seriesTempDeW.strokeWidth = 1;
        seriesTempDeW.stroke = am4core.color("#87f7ff");
        seriesTempDeW.tooltip.getFillFromObject = false;
        seriesTempDeW.tooltip.background.fill = am4core.color("#87f7ff");
        seriesTempDeW.tooltip.label.fill = am4core.color("#000");
        seriesTempDeW.tensionY = 1;
        seriesTempDeW.tensionX = 0.8;

        // var seriesTempIn = temp.series.push(new am4charts.LineSeries());
        // seriesTempIn.dataFields.valueY = "TempInCur";
        // seriesTempIn.dataFields.dateX = "ObsTime";
        // seriesTempIn.tooltipText = "Indoor {TempInCur} °C";
        // seriesTempIn.strokeWidth = 1;
        // seriesTempIn.stroke = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.getFillFromObject = false;
        // seriesTempIn.tooltip.background.fill = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.label.fill = am4core.color("#000");
        // temp.scrollbarX = new am4core.Scrollbar();
        temp.cursor = new am4charts.XYCursor();

        // Create tMinMax series
        var seriesTempMin = tminmax.series.push(new am4charts.LineSeries());
        seriesTempMin.dataFields.valueY = "Tmin";
        seriesTempMin.dataFields.dateX = "ObsTime";
        seriesTempMin.tooltipText = "{Tmin} °C min";
        seriesTempMin.strokeWidth = 1;
        seriesTempMin.stroke = am4core.color("#0ec7ff");
        seriesTempMin.tooltip.getFillFromObject = false;
        seriesTempMin.tooltip.background.fill = am4core.color("#0ec7ff");
        seriesTempMin.tooltip.label.fill = am4core.color("#000");
        seriesTempMin.tensionY = 1;
        seriesTempMin.tensionX = 0.8;
        var seriesTempMax = tminmax.series.push(new am4charts.LineSeries());
        seriesTempMax.dataFields.valueY = "Tmax";
        seriesTempMax.dataFields.dateX = "ObsTime";
        seriesTempMax.tooltipText = "{Tmax} °C max";
        seriesTempMax.strokeWidth = 1;
        seriesTempMax.stroke = am4core.color("#ff2955");
        seriesTempMax.tooltip.getFillFromObject = false;
        seriesTempMax.tooltip.background.fill = am4core.color("#ff2955");
        seriesTempMax.tooltip.label.fill = am4core.color("#000");
        seriesTempMax.tensionY = 1;
        seriesTempMax.tensionX = 0.8;
        // tminmax.scrollbarX = new am4core.Scrollbar();
        tminmax.cursor = new am4charts.XYCursor();

        // Create Hum series
        var seriesHum = hum.series.push(new am4charts.LineSeries());
        seriesHum.dataFields.valueY = "HumOutCur";
        seriesHum.dataFields.dateX = "ObsTime";
        seriesHum.tooltipText = "{HumOutCur} %";
        seriesHum.strokeWidth = 1;
        seriesHum.stroke = am4core.color("#5c8fff");
        seriesHum.tooltip.getFillFromObject = false;
        seriesHum.tooltip.background.fill = am4core.color("#5c8fff");
        seriesHum.tooltip.label.fill = am4core.color("#000");
        seriesHum.tensionY = 1;
        seriesHum.tensionX = 0.8;
        var seriesHuIn = hum.series.push(new am4charts.LineSeries());
        seriesHuIn.dataFields.valueY = "HumInCur";
        seriesHuIn.dataFields.dateX = "ObsTime";
        seriesHuIn.tooltipText = "{HumInCur} %";
        seriesHuIn.strokeWidth = 1;
        seriesHuIn.stroke = am4core.color("#0ec7ff");
        seriesHuIn.tooltip.getFillFromObject = false;
        seriesHuIn.tooltip.background.fill = am4core.color("#0ec7ff");
        seriesHuIn.tooltip.label.fill = am4core.color("#000");
        seriesHuIn.tensionY = 1;
        seriesHuIn.tensionX = 0.8;
        // tminmax.scrollbarX = new am4core.Scrollbar();
        hum.cursor = new am4charts.XYCursor();

        // Create wind series
        var seriesWind = wind.series.push(new am4charts.LineSeries());
        seriesWind.dataFields.valueY = "WindSpeedCur";
        seriesWind.dataFields.dateX = "ObsTime";
        seriesWind.tooltipText = "Current {WindSpeedCur} km/h";
        seriesWind.strokeWidth = 1;
        seriesWind.stroke = am4core.color("#11ff1e");
        seriesWind.tooltip.getFillFromObject = false;
        seriesWind.tooltip.background.fill = am4core.color("#11ff1e");
        seriesWind.tooltip.label.fill = am4core.color("#000");
        seriesWind.tensionY = 1;
        seriesWind.tensionX = 0.8;
        var seriesWindGust = wind.series.push(new am4charts.LineSeries());
        seriesWindGust.dataFields.valueY = "WindGust10";
        seriesWindGust.dataFields.dateX = "ObsTime";
        seriesWindGust.tooltipText = "Gust {WindGust10} km/h";
        seriesWindGust.strokeWidth = 1;
        seriesWindGust.stroke = am4core.color("#ffbf8d");
        seriesWindGust.tooltip.getFillFromObject = false;
        seriesWindGust.tooltip.background.fill = am4core.color("#ffbf8d");
        seriesWindGust.tooltip.label.fill = am4core.color("#000");
        seriesWindGust.tensionY = 1;
        seriesWindGust.tensionX = 0.8;
        var seriesWinAvg = wind.series.push(new am4charts.LineSeries());
        seriesWinAvg.dataFields.valueY = "WindAvgSpeedCur";
        seriesWinAvg.dataFields.dateX = "ObsTime";
        seriesWinAvg.tooltipText = "Avg {WindAvgSpeedCur} km/h";
        seriesWinAvg.strokeWidth = 1;
        seriesWinAvg.stroke = am4core.color("#ff8d8d");
        seriesWinAvg.tooltip.getFillFromObject = false;
        seriesWinAvg.tooltip.background.fill = am4core.color("#ff8d8d");
        seriesWinAvg.tooltip.label.fill = am4core.color("#000");
        seriesWinAvg.tensionY = 1;
        seriesWinAvg.tensionX = 0.8;
        wind.cursor = new am4charts.XYCursor();
        wind.cursor = new am4charts.XYCursor();


        // Create rain series
        var seriesRain = rain.series.push(new am4charts.LineSeries());
        seriesRain.dataFields.valueY = "RainDay";
        seriesRain.dataFields.dateX = "ObsTime";
        seriesRain.tooltipText = "{RainDay} mm";
        seriesRain.strokeWidth = 1;
        seriesRain.tensionY = 1;
        seriesRain.tensionX = 0.8;
        var seriesRainRate = rain.series.push(new am4charts.LineSeries());
        seriesRainRate.dataFields.valueY = "RainRateCur";
        seriesRainRate.dataFields.dateX = "ObsTime";
        seriesRainRate.tooltipText = "{RainRateCur} mm/h";
        seriesRainRate.strokeWidth = 1;
        seriesRainRate.tensionY = 1;
        seriesRainRate.tensionX = 0.8;
        rain.cursor = new am4charts.XYCursor();

        // Create pressure series
        var seriesPressure = pressure.series.push(new am4charts.LineSeries());
        seriesPressure.dataFields.valueY = "PressCur";
        seriesPressure.dataFields.dateX = "ObsTime";
        seriesPressure.tooltipText = "{PressCur} hPa";
        seriesPressure.strokeWidth = 1;
        seriesPressure.tensionY = 1;
        seriesPressure.tensionX = 0.8;
        pressure.cursor = new am4charts.XYCursor();

        // Create solar series
        var seriesSolar = solar.series.push(new am4charts.LineSeries());
        seriesSolar.dataFields.valueY = "SolarRad";
        seriesSolar.dataFields.dateX = "ObsTime";
        seriesSolar.tooltipText = "{SolarRad} W/m²";
        seriesSolar.strokeWidth = 1;
        seriesSolar.stroke = am4core.color("#ffdf43");
        seriesSolar.tooltip.getFillFromObject = false;
        seriesSolar.tooltip.background.fill = am4core.color("#ffdf43");
        seriesSolar.tooltip.label.fill = am4core.color("#000");
        seriesSolar.tensionY = 1;
        seriesSolar.tensionX = 0.8;
        solar.cursor = new am4charts.XYCursor();

        // Create solar series
        var seriesUV = uv.series.push(new am4charts.LineSeries());
        seriesUV.dataFields.valueY = "UV";
        seriesUV.dataFields.dateX = "ObsTime";
        seriesUV.tooltipText = "{UV}";
        seriesUV.strokeWidth = 1;
        seriesUV.stroke = am4core.color("#ffdf43");
        seriesUV.tooltip.getFillFromObject = false;
        seriesUV.tooltip.background.fill = am4core.color("#ffdf43");
        seriesUV.tooltip.label.fill = am4core.color("#000");
        seriesUV.tensionY = 1;
        seriesUV.tensionX = 0.8;
        uv.cursor = new am4charts.XYCursor();

        // Create windir series
        var seriesWindDir = wd.series.push(new am4charts.LineSeries());
        seriesWindDir.dataFields.valueY = "WindDirCur";
        seriesWindDir.dataFields.dateX = "ObsTime";
        seriesWindDir.tooltipText = "{WindDirCur}° / {WindDirCurEng} current";
        seriesWindDir.strokeWidth = 0;
        seriesWindDir.stroke = am4core.color("#7fdfff");
        seriesWindDir.tooltip.getFillFromObject = false;
        seriesWindDir.tooltip.background.fill = am4core.color("#7fdfff");
        seriesWindDir.tooltip.label.fill = am4core.color("#000");
        seriesWindDir.tensionY = 1;
        seriesWindDir.tensionX = 0.8;
        seriesWindDir.connect = false;

        var bullet1 = seriesWindDir.bullets.push(new am4core.Circle());
        bullet1.radius = 1;


        var seriesWindDirAvg = wd.series.push(new am4charts.LineSeries());
        seriesWindDirAvg.dataFields.valueY = "WindDirAvg10";
        seriesWindDirAvg.dataFields.dateX = "ObsTime";
        seriesWindDirAvg.tooltipText = "{WindDirAvg10}° / {WindDirAvg10Eng} average";
        seriesWindDirAvg.strokeWidth = 0;
        seriesWindDirAvg.stroke = am4core.color("#dafaff");
        seriesWindDirAvg.tooltip.getFillFromObject = false;
        seriesWindDirAvg.tooltip.background.fill = am4core.color("#dafaff");
        seriesWindDirAvg.tooltip.label.fill = am4core.color("#000");
        seriesWindDirAvg.tensionY = 1;
        seriesWindDirAvg.tensionX = 0.8;
        seriesWindDirAvg.connect = false;
        var bullet2 = seriesWindDirAvg.bullets.push(new am4core.Circle());
        bullet2.radius = 1;

        wd.cursor = new am4charts.XYCursor();

        /* Create windrose instance */
        var windrose = am4core.create("windrose", am4charts.RadarChart);

        /* Create axes */
        var xAxis = windrose.xAxes.push(new am4charts.ValueAxis());
        xAxis.renderer.maxLabelPosition = 0.99;
        xAxis.min = 0;
        xAxis.max = 360;
        xAxis.renderer.minGridDistance = 40;
        xAxis.strictMinMax = true;
        xAxis.dateFormatter = new am4core.DateFormatter();
        xAxis.dateFormatter.dateFormat = "HH:mm";
        // var categoryAxisWR = windrose.xAxes.push(new am4charts.DateAxis());
        // categoryAxisWR.tooltipDateFormat = "HH:mm";
        // xAxis.numberFormatter.numberFormat = "#.0°|0°";


        var yAxis = windrose.yAxes.push(new am4charts.ValueAxis());
        yAxis.renderer.labels.disabled = false;
        // yAxis.renderer.labels.template.verticalCenter = "bottom";
        // yAxis.renderer.labels.template.horizontalCenter = "right";
        // yAxis.renderer.maxLabelPosition = 01;
        // yAxis.renderer.labels.template.paddingBottom = 1;
        // yAxis.renderer.labels.template.paddingRight = 3;
        // yAxis.renderer.minGridDistance = 20;


        /* Create and configure series */
        var windspeed = windrose.series.push(new am4charts.RadarSeries());
        var circleBulletWS = windspeed.bullets.push(new am4core.Circle());
        circleBulletWS.tooltipText = "{WindSpeedCur} km/h @ {WindDirCur}° {WindDirCurEng}";
        circleBulletWS.radius = 3;
        circleBulletWS.strokeWidth = 1;
        windspeed.strokeOpacity = 0;
        windspeed.dataFields.valueX = "WindDirCur";
        windspeed.dataFields.valueY = "WindSpeedCur";
        windspeed.name = "Speed";
        windspeed.sequencedInterpolation = true;
        windspeed.sequencedInterpolationDelay = 10;
        windspeed.data = winddat;
        windspeed.fill = am4core.color("#15dbac");


        var windgust = windrose.series.push(new am4charts.RadarSeries());
        var circleBulletWG = windgust.bullets.push(new am4core.Circle());
        circleBulletWG.tooltipText = "{WindGust10} km/h @ {WindDirCur}° {WindDirCurEng}";
        circleBulletWG.radius = 3;
        circleBulletWG.strokeWidth = 1;
        windgust.strokeOpacity = 0;
        windgust.dataFields.valueX = "WindDirCur";
        windgust.dataFields.valueY = "WindGust10";
        windgust.name = "Gust";
        windgust.sequencedInterpolation = true;
        windgust.sequencedInterpolationDelay = 10;
        windgust.data = winddat;
        windgust.fill = am4core.color("#8fbfbf");

        var windAvg = windrose.series.push(new am4charts.RadarSeries());
        var circleBulletWA = windAvg.bullets.push(new am4core.Circle());
        circleBulletWA.tooltipText = "{WindAvgSpeedCur} km/h @ {WindDirCur}° {WindDirCurEng}";
        circleBulletWA.radius = 3;
        circleBulletWA.strokeWidth = 1;
        windAvg.strokeOpacity = 0;
        windAvg.dataFields.valueX = "WindDirCur";
        windAvg.dataFields.valueY = "WindAvgSpeedCur";
        windAvg.name = "Avg";
        windAvg.sequencedInterpolation = true;
        windAvg.sequencedInterpolationDelay = 10;
        windAvg.data = winddat;
        windAvg.fill = am4core.color("#c1c1c1");


        /* Add legend */
        windrose.legend = new am4charts.Legend();
        /* Add cursor */
        // windrose.cursor = new am4charts.RadarCursor();
        if (raining) {
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
            circleBulletRR.tooltipText = "{RainRateCur} mm/h from {WindDirAvg10}° {WindDirAvg10Eng}";
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
            rainRate.fill = am4core.color("#ffffff");
        }

        if (h < 2) {
            var tempRose = am4core.create("chartTR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "WindDirCurEng";
            /* Create axes */
            var xAxisTR = tempRose.xAxes.push(new am4charts.ValueAxis());
            xAxisTR.renderer.maxLabelPosition = 0.99;
            xAxisTR.min = 0;
            xAxisTR.max = 360;
            xAxisTR.renderer.minGridDistance = 40;
            xAxisTR.strictMinMax = true;
            xAxisTR.dateFormatter = new am4core.DateFormatter();
            xAxisTR.dateFormatter.dateFormat = "HH:mm";
            // var categoryAxisWR = windrose.xAxes.push(new am4charts.DateAxis());
            // categoryAxisWR.tooltipDateFormat = "HH:mm";
            // xAxis.numberFormatter.numberFormat = "#.0°|0°";


            var yAxisTR = tempRose.yAxes.push(new am4charts.ValueAxis());
            yAxisTR.renderer.labels.disabled = true;
            // yAxis.renderer.labels.template.verticalCenter = "bottom";
            // yAxis.renderer.labels.template.horizontalCenter = "right";
            // yAxis.renderer.maxLabelPosition = 01;
            // yAxis.renderer.labels.template.paddingBottom = 1;
            // yAxis.renderer.labels.template.paddingRight = 3;
            // yAxis.renderer.minGridDistance = 20;


            /* Create and configure series */
            var tempd = tempRose.series.push(new am4charts.RadarSeries());
            var circleBulletTR = tempd.bullets.push(new am4core.Circle());
            circleBulletTR.tooltipText = "{Tmin} °C from {WindDirAvg10}° {WindDirAvg10Eng}";
            circleBulletTR.radius = 3;
            circleBulletTR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            tempd.strokeOpacity = 0;
            tempd.dataFields.valueX = "WindDirAvg10";
            tempd.dataFields.valueY = "Tmin";
            tempd.name = "Temp Min";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            tempd.data = objdat;
            tempd.fill = am4core.color("#0ec7ff");

            var tempMd = tempRose.series.push(new am4charts.RadarSeries());
            var circleBulletTmR = tempMd.bullets.push(new am4core.Circle());
            circleBulletTmR.tooltipText = "{Tmax} °C from {WindDirAvg10}° {WindDirAvg10Eng}";
            circleBulletTmR.radius = 3;
            circleBulletTmR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            tempMd.strokeOpacity = 0;
            tempMd.dataFields.valueX = "WindDirAvg10";
            tempMd.dataFields.valueY = "Tmax";
            tempMd.name = "Temp Max";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            tempMd.data = objdat;
            tempMd.fill = am4core.color("#ff2955");
            tempRose.legend = new am4charts.Legend();
            tempRose.cursor = new am4charts.RadarCursor();

            var pressR = am4core.create("chartPR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "WindDirCurEng";
            /* Create axes */
            var xAxisPR = pressR.xAxes.push(new am4charts.ValueAxis());
            xAxisPR.renderer.maxLabelPosition = 0.99;
            xAxisPR.min = 0;
            xAxisPR.max = 360;
            xAxisPR.renderer.minGridDistance = 40;
            xAxisPR.strictMinMax = true;
            xAxisPR.dateFormatter = new am4core.DateFormatter();
            xAxisPR.dateFormatter.dateFormat = "HH:mm";
            // var categoryAxisWR = windrose.xAxes.push(new am4charts.DateAxis());
            // categoryAxisWR.tooltipDateFormat = "HH:mm";
            // xAxis.numberFormatter.numberFormat = "#.0°|0°";


            var yAxisPR = pressR.yAxes.push(new am4charts.ValueAxis());
            yAxisPR.renderer.labels.disabled = true;
            // yAxis.renderer.labels.template.verticalCenter = "bottom";
            // yAxis.renderer.labels.template.horizontalCenter = "right";
            // yAxis.renderer.maxLabelPosition = 01;
            // yAxis.renderer.labels.template.paddingBottom = 1;
            // yAxis.renderer.labels.template.paddingRight = 3;
            // yAxis.renderer.minGridDistance = 20;


            /* Create and configure series */
            var pressD = pressR.series.push(new am4charts.RadarSeries());
            var circleBulletPR = pressD.bullets.push(new am4core.Circle());
            circleBulletPR.tooltipText = "{PressCur} hPa from {WindDirAvg10}° {WindDirAvg10Eng}";
            circleBulletPR.radius = 3;
            circleBulletPR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            pressD.strokeOpacity = 0;
            pressD.dataFields.valueX = "WindDirAvg10";
            pressD.dataFields.valueY = "PressCur";
            pressD.name = "Pressure";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            pressD.data = objdat;
            pressD.fill = am4core.color("#43fff9");
            pressR.legend = new am4charts.Legend();
            pressR.cursor = new am4charts.RadarCursor();

            var humRose = am4core.create("chartHR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "WindDirCurEng";
            /* Create axes */
            var xAxisHR = humRose.xAxes.push(new am4charts.ValueAxis());
            xAxisHR.renderer.maxLabelPosition = 0.99;
            xAxisHR.min = 0;
            xAxisHR.max = 360;
            xAxisHR.renderer.minGridDistance = 40;
            xAxisHR.strictMinMax = true;
            xAxisHR.dateFormatter = new am4core.DateFormatter();
            xAxisHR.dateFormatter.dateFormat = "HH:mm";
            // var categoryAxisWR = windrose.xAxes.push(new am4charts.DateAxis());
            // categoryAxisWR.tooltipDateFormat = "HH:mm";
            // xAxis.numberFormatter.numberFormat = "#.0°|0°";


            var yAxisHR = humRose.yAxes.push(new am4charts.ValueAxis());
            yAxisHR.renderer.labels.disabled = true;
            // yAxis.renderer.labels.template.verticalCenter = "bottom";
            // yAxis.renderer.labels.template.horizontalCenter = "right";
            // yAxis.renderer.maxLabelPosition = 01;
            // yAxis.renderer.labels.template.paddingBottom = 1;
            // yAxis.renderer.labels.template.paddingRight = 3;
            // yAxis.renderer.minGridDistance = 20;


            /* Create and configure series */
            var humd = humRose.series.push(new am4charts.RadarSeries());
            var circleBulletHR = humd.bullets.push(new am4core.Circle());
            circleBulletHR.tooltipText = "{HumOutCur} % from {WindDirAvg10}° {WindDirAvg10Eng}";
            circleBulletHR.radius = 3;
            circleBulletHR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            humd.strokeOpacity = 0;
            humd.dataFields.valueX = "WindDirAvg10";
            humd.dataFields.valueY = "HumOutCur";
            humd.name = "Humidity";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            humd.data = objdat;
            humd.fill = am4core.color("#43fff9");
            humRose.legend = new am4charts.Legend();
            humRose.cursor = new am4charts.RadarCursor();
        }
    }
    if (h === 3){
        var datas = objdata;
        // BMx280, MLX90614 - Ambient Tempratures
        var amb = am4core.create("chartamb", am4charts.XYChart);
        amb.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelamb = amb.chartContainer.createChild(am4core.Label);
        labelamb.text = "Ambient temperatures";
        labelamb.align = "center";
                      
        // MLX90614 - IR sky temp(object temp)
        var sky = am4core.create("chartir", am4charts.XYChart);
        sky.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelsky = sky.chartContainer.createChild(am4core.Label);
        labelsky.text = "Sky temperature";
        labelsky.align = "center";
        
        // BMx280 - absolute pressure
        var Pabs = am4core.create("chartpabs", am4charts.XYChart);
        Pabs.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelPabs = Pabs.chartContainer.createChild(am4core.Label);
        labelPabs.text = "Pressure Relative";
        labelPabs.align = "center";
        
        // // BMP280 - relative pressure
        // var Prel = am4core.create("chartprel", am4charts.XYChart);
        // Prel.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        // var labelPrel = Prel.chartContainer.createChild(am4core.Label);
        // labelPrel.text = "Pressure relative";
        // labelPrel.align = "center";
        
        //DHT - Sensors - Humidity
        var bmehum = am4core.create("charthum", am4charts.XYChart);
        bmehum.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelhum = bmehum.chartContainer.createChild(am4core.Label);
        labelhum.text = "Humidity";
        labelhum.align = "center";

        //CSS811 - Sensor - CO2 and TVOC
        var chartco2 = am4core.create("chartco2", am4charts.XYChart);
        chartco2.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelDHTTemp = chartco2.chartContainer.createChild(am4core.Label);
        labelDHTTemp.text = "Air Quality";
        labelDHTTemp.align = "center";

        //DS18B20 - Sensor - Ground Temperature
        var gndtemp = am4core.create("chartgndTemp", am4charts.XYChart);
        gndtemp.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelgndtemp = gndtemp.chartContainer.createChild(am4core.Label);
        labelgndtemp.text = "Ground Temp";
        labelgndtemp.align = "center";
        
        //Capacitive Moisture - Sensor - RH of ground
        var gndmoist = am4core.create("chartgndMoist", am4charts.XYChart);
        gndmoist.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelgndMoist = gndmoist.chartContainer.createChild(am4core.Label);
        labelgndMoist.text = "Ground Moisture";
        labelgndMoist.align = "center";
        
        //Cloud Cover
        var cloud = am4core.create("chartgnd", am4charts.XYChart);
        cloud.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelcloudcover = cloud.chartContainer.createChild(am4core.Label);
        labelcloudcover.text = "Cloud Cover";
        labelcloudcover.align = "center";

        //Cloud Cover
        var lightning = am4core.create("chartlightning", am4charts.XYChart);
        lightning.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labellightning = lightning.chartContainer.createChild(am4core.Label);
        labellightning.text = "Lightning strikes";
        labellightning.align = "center";
        
        //MLX and dew point
        var mlxdew = am4core.create("chartmlx", am4charts.XYChart);
        mlxdew.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelmlxdew = mlxdew.chartContainer.createChild(am4core.Label);
        labelmlxdew.text = "MLX ambient and Dew Point";
        labelmlxdew.align = "center";
        
        amb.data = datas;
        sky.data = datas;
        Pabs.data = datas;
        // Prel.data = datas;
        bmehum.data = datas;
        chartco2.data = datas;
        cloud.data = datas;
        gndtemp.data = datas;
        gndmoist.data = datas;
        lightning.data = datas;
        mlxdew.data = datas;
        
               
        // Create temp axes
        var categoryAxisAmb = amb.xAxes.push(new am4charts.DateAxis());
        categoryAxisAmb.renderer.grid.template.location = 0;
        categoryAxisAmb.renderer.minGridDistance = 60;
        categoryAxisAmb.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisAmb.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisAmb.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisAmb.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisAmb.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisAmb.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisAmb.dateFormats.setKey("second", "HH:mm");
        }
        var categoryAxisSky = sky.xAxes.push(new am4charts.DateAxis());
        categoryAxisSky.renderer.grid.template.location = 0;
        categoryAxisSky.renderer.minGridDistance = 60;
        categoryAxisSky.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisSky.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisSky.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisSky.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisSky.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisSky.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisSky.dateFormats.setKey("second", "HH:mm");
        }
        var categoryAxisPabs = Pabs.xAxes.push(new am4charts.DateAxis());
        categoryAxisPabs.renderer.grid.template.location = 0;
        categoryAxisPabs.renderer.minGridDistance = 60;
        categoryAxisPabs.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisPabs.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisPabs.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisPabs.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisPabs.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisPabs.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisPabs.dateFormats.setKey("second", "HH:mm");
        }
        // var categoryAxisPrel = Prel.xAxes.push(new am4charts.DateAxis());
        // categoryAxisPrel.renderer.grid.template.location = 0;
        // categoryAxisPrel.renderer.minGridDistance = 60;
        // categoryAxisPrel.baseInterval = {
        //     "timeUnit": "minute"
        // };
        // switch (h) {
        //     case 1:
        //         categoryAxisPrel.baseInterval = {
        //             "timeUnit": "minute"
        //         };
        //         categoryAxisPrel.dateFormats.setKey("minute", "HH:mm");
        //         break;
        //     case 2:
        //         categoryAxisPrel.baseInterval = {
        //             "timeUnit": "minute",
        //             "count": 30
        //         };
        //         categoryAxisPrel.dateFormats.setKey("minute", "dd-MM HH:mm");
        //         break;
        //     default:
        //         categoryAxisPrel.baseInterval = {
        //             "timeUnit": "second",
        //             "count": 15
        //         };
        //         categoryAxisPrel.dateFormats.setKey("second", "HH:mm");
        // }
        // Create DHT - Humidity axes
        var categoryAxisDhtHum = bmehum.xAxes.push(new am4charts.DateAxis());
        categoryAxisDhtHum.renderer.grid.template.location = 0;
        categoryAxisDhtHum.renderer.minGridDistance = 60;
        categoryAxisDhtHum.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisDhtHum.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisDhtHum.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisDhtHum.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisDhtHum.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisDhtHum.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisDhtHum.dateFormats.setKey("second", "HH:mm");
        }

        // Create DHT - Temp axes
        var categoryAxisCCS811 = chartco2.xAxes.push(new am4charts.DateAxis());
        categoryAxisCCS811.renderer.grid.template.location = 0;
        categoryAxisCCS811.renderer.minGridDistance = 60;
        categoryAxisCCS811.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisCCS811.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisCCS811.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisCCS811.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisCCS811.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisCCS811.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisCCS811.dateFormats.setKey("second", "HH:mm");
        }

        // Cloud Cover
        var categoryCloudCover = cloud.xAxes.push(new am4charts.DateAxis());
        categoryCloudCover.renderer.grid.template.location = 0;
        categoryCloudCover.renderer.minGridDistance = 60;
        categoryCloudCover.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryCloudCover.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryCloudCover.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryCloudCover.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryCloudCover.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryCloudCover.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryCloudCover.dateFormats.setKey("second", "HH:mm");
        }
        // Create DS18B20 - Ground Temprature
        var categoryAxisgndtemp = gndtemp.xAxes.push(new am4charts.DateAxis());
        categoryAxisgndtemp.renderer.grid.template.location = 0;
        categoryAxisgndtemp.renderer.minGridDistance = 60;
        categoryAxisgndtemp.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisgndtemp.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisgndtemp.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisgndtemp.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisgndtemp.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisgndtemp.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisgndtemp.dateFormats.setKey("second", "HH:mm");
        }
        // Create Ground moisture axis
        var categoryAxisgndmoist = gndmoist.xAxes.push(new am4charts.DateAxis());
        categoryAxisgndmoist.renderer.grid.template.location = 0;
        categoryAxisgndmoist.renderer.minGridDistance = 60;
        categoryAxisgndmoist.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxisgndmoist.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxisgndmoist.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxisgndmoist.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxisgndmoist.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxisgndmoist.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxisgndmoist.dateFormats.setKey("second", "HH:mm");
        }
        
        // Create lightninge axis
        var categoryAxislightning = lightning.xAxes.push(new am4charts.DateAxis());
        categoryAxislightning.renderer.grid.template.location = 0;
        categoryAxislightning.renderer.minGridDistance = 60;
        categoryAxislightning.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxislightning.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxislightning.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxislightning.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxislightning.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxislightning.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxislightning.dateFormats.setKey("second", "HH:mm");
        }
        // Create lightninge axis
        var categoryAxismlxdew = mlxdew.xAxes.push(new am4charts.DateAxis());
        categoryAxismlxdew.renderer.grid.template.location = 0;
        categoryAxismlxdew.renderer.minGridDistance = 60;
        categoryAxismlxdew.baseInterval = {
            "timeUnit": "minute"
        };
        switch (h) {
            case 1:
                categoryAxismlxdew.baseInterval = {
                    "timeUnit": "minute"
                };
                categoryAxismlxdew.dateFormats.setKey("minute", "HH:mm");
                break;
            case 2:
                categoryAxismlxdew.baseInterval = {
                    "timeUnit": "minute",
                    "count": 30
                };
                categoryAxismlxdew.dateFormats.setKey("minute", "dd-MM HH:mm");
                break;
            default:
                categoryAxismlxdew.baseInterval = {
                    "timeUnit": "second",
                    "count": 15
                };
                categoryAxismlxdew.dateFormats.setKey("second", "HH:mm");
        }
        
        var valueAxisAmb = amb.yAxes.push(new am4charts.ValueAxis());
        var valueAxisSky = sky.yAxes.push(new am4charts.ValueAxis());
        var valueAxisPabs = Pabs.yAxes.push(new am4charts.ValueAxis());
        // var valueAxisPrel = Prel.yAxes.push(new am4charts.ValueAxis());
        var valueAxisDhtHum = bmehum.yAxes.push(new am4charts.ValueAxis());
        var valueAxisCCS811 = chartco2.yAxes.push(new am4charts.ValueAxis());
        var valueAxiscloudtemp = cloud.yAxes.push(new am4charts.ValueAxis());
        valueAxiscloudtemp.min = 0;
        valueAxiscloudtemp.max = 100;
        var valueAxisgndtemp = gndtemp.yAxes.push(new am4charts.ValueAxis());
        valueAxisgndtemp.min = 0;
        // valueAxisgndtemp.max = 30;
        var valueAxisgndmoist = gndmoist.yAxes.push(new am4charts.ValueAxis());
        valueAxisgndmoist.min = 0;
        valueAxisgndmoist.max = 100;
        var valueAxislightning = lightning.yAxes.push(new am4charts.ValueAxis());
        valueAxislightning.min = 0;
        var valueAxismlxdew = mlxdew.yAxes.push(new am4charts.ValueAxis());


        // Create temp series
        var seriesBMPTemp = amb.series.push(new am4charts.LineSeries());
        seriesBMPTemp.dataFields.valueY = "bmp280temp";
        seriesBMPTemp.dataFields.dateX = "ObsTime";
        seriesBMPTemp.tooltipText = "BME280_1 {bmp280temp} °C";
        seriesBMPTemp.strokeWidth = 1;
        seriesBMPTemp.stroke = am4core.color("#ffb545");
        seriesBMPTemp.tooltip.getFillFromObject = false;
        seriesBMPTemp.tooltip.background.fill = am4core.color("#ffb545");
        seriesBMPTemp.tooltip.label.fill = am4core.color("#000");
        
        // Create temp series
        var seriesBMPTemp_2 = amb.series.push(new am4charts.LineSeries());
        seriesBMPTemp_2.dataFields.valueY = "bmp280temp_2";
        seriesBMPTemp_2.dataFields.dateX = "ObsTime";
        seriesBMPTemp_2.tooltipText = "BME280_2 {bmp280temp_2} °C";
        seriesBMPTemp_2.strokeWidth = 1;
        seriesBMPTemp_2.stroke = am4core.color("#ff6c09");
        seriesBMPTemp_2.tooltip.getFillFromObject = false;
        seriesBMPTemp_2.tooltip.background.fill = am4core.color("#ff6c09");
        seriesBMPTemp_2.tooltip.label.fill = am4core.color("#000");
        
        // var seriesDHT22 = amb.series.push(new am4charts.LineSeries());
        // seriesDHT22.dataFields.valueY = "dht1temp";
        // seriesDHT22.dataFields.dateX = "ObsTime";
        // seriesDHT22.tooltipText = "DHT22 {dht1temp} °C";
        // seriesDHT22.strokeWidth = 1;
        // seriesDHT22.stroke = am4core.color("#c21128");
        // seriesDHT22.tooltip.getFillFromObject = false;
        // seriesDHT22.tooltip.background.fill = am4core.color("#c21128");
        // seriesDHT22.tooltip.label.fill = am4core.color("#000");

        // var seriesTempAvg = amb.series.push(new am4charts.LineSeries());
        // seriesTempAvg.dataFields.valueY = "avgtemp";
        // seriesTempAvg.dataFields.dateX = "ObsTime";
        // seriesTempAvg.tooltipText = "Average Temp {avgtemp} °C";
        // seriesTempAvg.strokeWidth = 1;
        // seriesTempAvg.stroke = am4core.color("#9eb6b0");
        // seriesTempAvg.tooltip.getFillFromObject = false;
        // seriesTempAvg.tooltip.background.fill = am4core.color("#9eb6b0");
        // seriesTempAvg.tooltip.label.fill = am4core.color("#000");
        
        var seriesdew = mlxdew.series.push(new am4charts.LineSeries());
        seriesdew.dataFields.valueY = "dewpoint";
        seriesdew.dataFields.dateX = "ObsTime";
        seriesdew.tooltipText = "Dewpoint {dewpoint} °C";
        seriesdew.strokeWidth = 1;
        seriesdew.stroke = am4core.color("#ffffff");
        seriesdew.tooltip.getFillFromObject = false;
        seriesdew.tooltip.background.fill = am4core.color("#ffffff");
        seriesdew.tooltip.label.fill = am4core.color("#000");
        
        var seriesMLXTemp = mlxdew.series.push(new am4charts.LineSeries());
        seriesMLXTemp.dataFields.valueY = "mlxambtemp";
        seriesMLXTemp.dataFields.dateX = "ObsTime";
        seriesMLXTemp.tooltipText = "MLX ambient {mlxambtemp} °C";
        seriesMLXTemp.strokeWidth = 1;
        seriesMLXTemp.stroke = am4core.color("#1955ec");
        seriesMLXTemp.tooltip.getFillFromObject = false;
        seriesMLXTemp.tooltip.background.fill = am4core.color("#1955ec");
        seriesMLXTemp.tooltip.label.fill = am4core.color("#ffffff");
        
        
        
        // seriesBMPTemp.heatRules.push({
        //     "target": seriesBMPTemp.lines.template,
        //     "property": "stroke",
        //     "min": am4core.color("#F5DBCB"),
        //     "max": am4core.color("#ED7B84"),
        //     "dataField": "valueY"
        // });
        // seriesBMPTemp.tensionY = 1;
        // seriesBMPTemp.tensionX = 0.8;
        // var seriesTempDeW = amb.series.push(new am4charts.LineSeries());
        // seriesTempDeW.dataFields.valueY = "DewCur";
        // seriesTempDeW.dataFields.dateX = "ObsTime";
        // seriesTempDeW.tooltipText = "Dew Point {DewCur} °C";
        // seriesTempDeW.strokeWidth = 1;
        // seriesTempDeW.stroke = am4core.color("#87f7ff");
        // seriesTempDeW.tooltip.getFillFromObject = false;
        // seriesTempDeW.tooltip.background.fill = am4core.color("#87f7ff");
        // seriesTempDeW.tooltip.label.fill = am4core.color("#000");
        // seriesTempDeW.tensionY = 1;
        // seriesTempDeW.tensionX = 0.8;

        // var seriesTempIn = temp.series.push(new am4charts.LineSeries());
        // seriesTempIn.dataFields.valueY = "TempInCur";
        // seriesTempIn.dataFields.dateX = "ObsTime";
        // seriesTempIn.tooltipText = "Indoor {TempInCur} °C";
        // seriesTempIn.strokeWidth = 1;
        // seriesTempIn.stroke = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.getFillFromObject = false;
        // seriesTempIn.tooltip.background.fill = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.label.fill = am4core.color("#000");
        // temp.scrollbarX = new am4core.Scrollbar();
        //sky
        var seriesMLXSkyTemp = sky.series.push(new am4charts.LineSeries());
        seriesMLXSkyTemp.dataFields.valueY = "mlxskytemp";
        seriesMLXSkyTemp.dataFields.dateX = "ObsTime";
        seriesMLXSkyTemp.tooltipText = "MLX sky {mlxskytemp} °C";
        seriesMLXSkyTemp.strokeWidth = 1;
        seriesMLXSkyTemp.stroke = am4core.color("#1b9dfa");
        seriesMLXSkyTemp.tooltip.getFillFromObject = false;
        seriesMLXSkyTemp.tooltip.background.fill = am4core.color("#1b9dfa");
        seriesMLXSkyTemp.tooltip.label.fill = am4core.color("#000");
        
        // var seriesAbsPressure = Pabs.series.push(new am4charts.LineSeries());
        // seriesAbsPressure.dataFields.valueY = "bmp280abspressure";
        // seriesAbsPressure.dataFields.dateX = "ObsTime";
        // seriesAbsPressure.tooltipText = "Absolute {bmp280abspressure} Pa";
        // seriesAbsPressure.strokeWidth = 1;
        // seriesAbsPressure.stroke = am4core.color("#1bfa39");
        // seriesAbsPressure.tooltip.getFillFromObject = false;
        // seriesAbsPressure.tooltip.background.fill = am4core.color("#1bfa39");
        // seriesAbsPressure.tooltip.label.fill = am4core.color("#000");

        var seriesRelPressure = Pabs.series.push(new am4charts.LineSeries());
        seriesRelPressure.dataFields.valueY = "bmp280relpressure";
        seriesRelPressure.dataFields.dateX = "ObsTime";
        seriesRelPressure.tooltipText = "Relative {bmp280relpressure} Pa";
        seriesRelPressure.strokeWidth = 1;
        seriesRelPressure.stroke = am4core.color("#1bfaa1");
        seriesRelPressure.tooltip.getFillFromObject = false;
        seriesRelPressure.tooltip.background.fill = am4core.color("#1bfaa1");
        seriesRelPressure.tooltip.label.fill = am4core.color("#000");

        var seriesRelPressure_2 = Pabs.series.push(new am4charts.LineSeries());
        seriesRelPressure_2.dataFields.valueY = "bmp280relpressure_2";
        seriesRelPressure_2.dataFields.dateX = "ObsTime";
        seriesRelPressure_2.tooltipText = "Relative {bmp280relpressure_2} Pa";
        seriesRelPressure_2.strokeWidth = 1;
        seriesRelPressure_2.stroke = am4core.color("#0faa24");
        seriesRelPressure_2.tooltip.getFillFromObject = false;
        seriesRelPressure_2.tooltip.background.fill = am4core.color("#0faa24");
        seriesRelPressure_2.tooltip.label.fill = am4core.color("#000");

        // var seriesdht1 = dhthum.series.push(new am4charts.LineSeries());
        // seriesdht1.dataFields.valueY = "dht1hum";
        // seriesdht1.dataFields.dateX = "ObsTime";
        // seriesdht1.tooltipText = "DHT22 {dht1hum} %";
        // seriesdht1.strokeWidth = 1;
        // seriesdht1.stroke = am4core.color("#97c9fc");
        // seriesdht1.tooltip.getFillFromObject = false;
        // seriesdht1.tooltip.background.fill = am4core.color("#97c9fc");
        // seriesdht1.tooltip.label.fill = am4core.color("#000");

        var seriesbmehum_1 = bmehum.series.push(new am4charts.LineSeries());
        seriesbmehum_1.dataFields.valueY = "bmp280humidity";
        seriesbmehum_1.dataFields.dateX = "ObsTime";
        seriesbmehum_1.tooltipText = "BME280_1 {bmp280humidity} %";
        seriesbmehum_1.strokeWidth = 1;
        seriesbmehum_1.stroke = am4core.color("#97c9fc");
        seriesbmehum_1.tooltip.getFillFromObject = false;
        seriesbmehum_1.tooltip.background.fill = am4core.color("#97c9fc");
        seriesbmehum_1.tooltip.label.fill = am4core.color("#000");

        var seriesbmehum_2 = bmehum.series.push(new am4charts.LineSeries());
        seriesbmehum_2.dataFields.valueY = "bmp280humidity_2";
        seriesbmehum_2.dataFields.dateX = "ObsTime";
        seriesbmehum_2.tooltipText = "BME280_2 {bmp280humidity_2} %";
        seriesbmehum_2.strokeWidth = 1;
        seriesbmehum_2.stroke = am4core.color("#498bff");
        seriesbmehum_2.tooltip.getFillFromObject = false;
        seriesbmehum_2.tooltip.background.fill = am4core.color("#498bff");
        seriesbmehum_2.tooltip.label.fill = am4core.color("#000");

        var seriesavghum = bmehum.series.push(new am4charts.LineSeries());
        seriesavghum.dataFields.valueY = "avghum";
        seriesavghum.dataFields.dateX = "ObsTime";
        seriesavghum.tooltipText = "Average {avghum} %";
        seriesavghum.strokeWidth = 1;
        seriesavghum.stroke = am4core.color("#1bfafa");
        seriesavghum.tooltip.getFillFromObject = false;
        seriesavghum.tooltip.background.fill = am4core.color("#1bfafa");
        seriesavghum.tooltip.label.fill = am4core.color("#000");

        var seriesDHT1Temp = chartco2.series.push(new am4charts.LineSeries());
        seriesDHT1Temp.dataFields.valueY = "co2";
        seriesDHT1Temp.dataFields.dateX = "ObsTime";
        seriesDHT1Temp.tooltipText = "CO2 {co2}";
        seriesDHT1Temp.strokeWidth = 1;
        seriesDHT1Temp.stroke = am4core.color("#ff4555");
        seriesDHT1Temp.tooltip.getFillFromObject = false;
        seriesDHT1Temp.tooltip.background.fill = am4core.color("#ff4555");
        seriesDHT1Temp.tooltip.label.fill = am4core.color("#000");
        
        var seriesDHT2Temp = chartco2.series.push(new am4charts.LineSeries());
        seriesDHT2Temp.dataFields.valueY = "tvoc";
        seriesDHT2Temp.dataFields.dateX = "ObsTime";
        seriesDHT2Temp.tooltipText = "TVOC {tvoc}";
        seriesDHT2Temp.strokeWidth = 1;
        seriesDHT2Temp.stroke = am4core.color("#ff0000");
        seriesDHT2Temp.tooltip.getFillFromObject = false;
        seriesDHT2Temp.tooltip.background.fill = am4core.color("#ff0000");
        seriesDHT2Temp.tooltip.label.fill = am4core.color("#000");

        // var seriesgndtemp = gndtemp.series.push(new am4charts.LineSeries());
        // seriesgndtemp.dataFields.valueY = "difference";
        // seriesgndtemp.dataFields.dateX = "ObsTime";
        // seriesgndtemp.tooltipText = "DewSky {difference} °C";
        // seriesgndtemp.strokeWidth = 1;
        // seriesgndtemp.stroke = am4core.color("#00fff8");
        // seriesgndtemp.tooltip.getFillFromObject = false;
        // seriesgndtemp.tooltip.background.fill = am4core.color("#00fff8");
        // seriesgndtemp.tooltip.label.fill = am4core.color("#ffffff");

        // var seriesgndtempdew = gndtemp.series.push(new am4charts.LineSeries());
        // seriesgndtempdew.dataFields.valueY = "ambientcloudheight";
        // seriesgndtempdew.dataFields.dateX = "ObsTime";
        // seriesgndtempdew.tooltipText = "amb height {ambientcloudheight}m";
        // seriesgndtempdew.strokeWidth = 1;
        // seriesgndtempdew.stroke = am4core.color("#b5deda");
        // seriesgndtempdew.tooltip.getFillFromObject = false;
        // seriesgndtempdew.tooltip.background.fill = am4core.color("#b5deda");
        // seriesgndtempdew.tooltip.label.fill = am4core.color("#ffffff");
        //
        // var seriesgndcoverage = gndtemp.series.push(new am4charts.LineSeries());
        // seriesgndcoverage.dataFields.valueY = "cloudheight";
        // seriesgndcoverage.dataFields.dateX = "ObsTime";
        // seriesgndcoverage.tooltipText = "cloud height {cloudheight}m";
        // seriesgndcoverage.strokeWidth = 1;
        // seriesgndcoverage.stroke = am4core.color("#b5deda");
        // seriesgndcoverage.tooltip.getFillFromObject = false;
        // seriesgndcoverage.tooltip.background.fill = am4core.color("#b5deda");
        // seriesgndcoverage.tooltip.label.fill = am4core.color("#ffffff");
        
        // var seriescloudcover = cloud.series.push(new am4charts.LineSeries());
        // seriescloudcover.dataFields.valueY = "coverage";
        // seriescloudcover.dataFields.dateX = "ObsTime";
        // seriescloudcover.tooltipText = "Cloudcover {coverage}% / Diff {diff}°C";
        // seriescloudcover.strokeWidth = 1;
        // seriescloudcover.stroke = am4core.color("#b5deda");
        // seriescloudcover.tooltip.getFillFromObject = false;
        // seriescloudcover.tooltip.background.fill = am4core.color("#b5deda");
        // seriescloudcover.tooltip.label.fill = am4core.color("#ffffff");

        var seriescc = cloud.series.push(new am4charts.LineSeries());
        seriescc.dataFields.valueY = "cc";
        seriescc.dataFields.dateX = "ObsTime";
        seriescc.tooltipText = "Cloudcover {cc}% / Diff {diff}°C";
        seriescc.strokeWidth = 1;
        seriescc.stroke = am4core.color("#47b7e2");
        seriescc.tooltip.getFillFromObject = false;
        seriescc.tooltip.background.fill = am4core.color("#47b7e2");
        seriescc.tooltip.label.fill = am4core.color("#ffffff");
        
        var seriesgndtemp = gndtemp.series.push(new am4charts.LineSeries());
        seriesgndtemp.dataFields.valueY = "groundtemp";
        seriesgndtemp.dataFields.dateX = "ObsTime";
        seriesgndtemp.tooltipText = "Ground Temp {groundtemp}°C";
        seriesgndtemp.strokeWidth = 1;
        seriesgndtemp.stroke = am4core.color("#a7491c");
        seriesgndtemp.tooltip.getFillFromObject = false;
        seriesgndtemp.tooltip.background.fill = am4core.color("#a7491c");
        seriesgndtemp.tooltip.label.fill = am4core.color("#ffffff");
        
        var seriesgndmoist = gndmoist.series.push(new am4charts.LineSeries());
        seriesgndmoist.dataFields.valueY = "groundmoisture";
        seriesgndmoist.dataFields.dateX = "ObsTime";
        seriesgndmoist.tooltipText = "Ground moisture {groundmoisture}%";
        seriesgndmoist.strokeWidth = 1;
        seriesgndmoist.stroke = am4core.color("#0bb4ea");
        seriesgndmoist.tooltip.getFillFromObject = false;
        seriesgndmoist.tooltip.background.fill = am4core.color("#0bb4ea");
        seriesgndmoist.tooltip.label.fill = am4core.color("#ffffff");

        var serieslightning = lightning.series.push(new am4charts.LineSeries());
        serieslightning.dataFields.valueY = "lidistance";
        serieslightning.dataFields.dateX = "ObsTime";
        serieslightning.tooltipText = "Lightning distance {lidistance} km";
        serieslightning.strokeWidth = 1;
        serieslightning.stroke = am4core.color("#ffffff");
        serieslightning.tooltip.getFillFromObject = false;
        serieslightning.tooltip.background.fill = am4core.color("#ffffff");
        serieslightning.tooltip.label.fill = am4core.color("#000000");
        // serieslightning.connect = false;
        // var bullet3 = serieslightning.bullets.push(new am4core.Circle());
        // bullet3.radius = 1;

        var serieslightningE = lightning.series.push(new am4charts.LineSeries());
        serieslightningE.dataFields.valueY = "lienergy";
        serieslightningE.dataFields.dateX = "ObsTime";
        serieslightningE.tooltipText = "Lightning energy {lienergy}";
        serieslightningE.strokeWidth = 1;
        serieslightningE.stroke = am4core.color("#ffffff");
        serieslightningE.tooltip.getFillFromObject = false;
        serieslightningE.tooltip.background.fill = am4core.color("#ffffff");
        serieslightningE.tooltip.label.fill = am4core.color("#000000");
        // serieslightningE.connect = false;
        // var bullet4 = serieslightningE.bullets.push(new am4core.Circle());
        // bullet4.radius = 1;

        amb.cursor = new am4charts.XYCursor();
        sky.cursor = new am4charts.XYCursor();
        Pabs.cursor = new am4charts.XYCursor();
        // Prel.cursor = new am4charts.XYCursor();
        bmehum.cursor = new am4charts.XYCursor();
        chartco2.cursor = new am4charts.XYCursor();
        cloud.cursor = new am4charts.XYCursor();
        gndtemp.cursor = new am4charts.XYCursor();
        gndmoist.cursor = new am4charts.XYCursor();
        lightning.cursor = new am4charts.XYCursor();
        mlxdew.cursor = new am4charts.XYCursor();

    }
});