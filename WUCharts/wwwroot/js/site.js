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
        labelTemp.text = "Temp & Dew point";
        labelTemp.align = "center";
        // temp.exporting.menu = new am4core.ExportMenu();
        // temp.exporting.menu.align = "left";
        // temp.exporting.menu.verticalAlign = "top";

        // Create TminMax chart instance
        var tminmax = am4core.create("chartminmax", am4charts.XYChart);
        tminmax.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelTemp = tminmax.chartContainer.createChild(am4core.Label);
        labelTemp.text = "Temp Min/Max";
        labelTemp.align = "center";

        // Create humidity chart instance
        var hum = am4core.create("charthum", am4charts.XYChart);
        hum.dateFormatter.inputDateFormat = "MM/dd/yyyy HH:mm";
        var labelHum = hum.chartContainer.createChild(am4core.Label);
        labelHum.text = "Humidity";
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
        labelPressure.text = "Pressure";
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
        seriesTemp.dataFields.valueY = "to";
        seriesTemp.dataFields.dateX = "ot";
        seriesTemp.tooltipText = "Outdoor {to} °C";
        seriesTemp.strokeWidth = 1.2;
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
        seriesTempDeW.dataFields.valueY = "dc";
        seriesTempDeW.dataFields.dateX = "ot";
        seriesTempDeW.tooltipText = "Dew Point {dc} °C";
        seriesTempDeW.strokeWidth = 1.2;
        seriesTempDeW.stroke = am4core.color("#87f7ff");
        seriesTempDeW.tooltip.getFillFromObject = false;
        seriesTempDeW.tooltip.background.fill = am4core.color("#87f7ff");
        seriesTempDeW.tooltip.label.fill = am4core.color("#000");
        seriesTempDeW.tensionY = 1;
        seriesTempDeW.tensionX = 0.8;

        // var seriesTempIn = temp.series.push(new am4charts.LineSeries());
        // seriesTempIn.dataFields.valueY = "TempInCur";
        // seriesTempIn.dataFields.dateX = "ot";
        // seriesTempIn.tooltipText = "Indoor {TempInCur} °C";
        // seriesTempIn.strokeWidth = 1.2;
        // seriesTempIn.stroke = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.getFillFromObject = false;
        // seriesTempIn.tooltip.background.fill = am4core.color("#fcff4c");
        // seriesTempIn.tooltip.label.fill = am4core.color("#000");
        // temp.scrollbarX = new am4core.Scrollbar();
        temp.cursor = new am4charts.XYCursor();

        // Create tMinMax series
        var seriesTempMin = tminmax.series.push(new am4charts.LineSeries());
        seriesTempMin.dataFields.valueY = "tmn";
        seriesTempMin.dataFields.dateX = "ot";
        seriesTempMin.tooltipText = "{tmn} °C min";
        seriesTempMin.strokeWidth = 1.2;
        seriesTempMin.stroke = am4core.color("#0ec7ff");
        seriesTempMin.tooltip.getFillFromObject = false;
        seriesTempMin.tooltip.background.fill = am4core.color("#0ec7ff");
        seriesTempMin.tooltip.label.fill = am4core.color("#000");
        seriesTempMin.tensionY = 1;
        seriesTempMin.tensionX = 0.8;
        var seriesTempMax = tminmax.series.push(new am4charts.LineSeries());
        seriesTempMax.dataFields.valueY = "tmx";
        seriesTempMax.dataFields.dateX = "ot";
        seriesTempMax.tooltipText = "{tmx} °C max";
        seriesTempMax.strokeWidth = 1.2;
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
        seriesHum.dataFields.valueY = "ho";
        seriesHum.dataFields.dateX = "ot";
        seriesHum.tooltipText = "Outdoors {ho} %";
        seriesHum.strokeWidth = 1.2;
        seriesHum.stroke = am4core.color("#5c8fff");
        seriesHum.tooltip.getFillFromObject = false;
        seriesHum.tooltip.background.fill = am4core.color("#5c8fff");
        seriesHum.tooltip.label.fill = am4core.color("#000");
        seriesHum.tensionY = 1;
        seriesHum.tensionX = 0.8;
        var seriesHuIn = hum.series.push(new am4charts.LineSeries());
        seriesHuIn.dataFields.valueY = "hi";
        seriesHuIn.dataFields.dateX = "ot";
        seriesHuIn.tooltipText = "Indoors {hi} %";
        seriesHuIn.strokeWidth = 1.2;
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
        seriesWind.dataFields.valueY = "ws";
        seriesWind.dataFields.dateX = "ot";
        seriesWind.tooltipText = "Current {ws} km/h";
        seriesWind.strokeWidth = 1.2;
        seriesWind.stroke = am4core.color("#11ff1e");
        seriesWind.tooltip.getFillFromObject = false;
        seriesWind.tooltip.background.fill = am4core.color("#11ff1e");
        seriesWind.tooltip.label.fill = am4core.color("#000");
        seriesWind.tensionY = 1;
        seriesWind.tensionX = 0.8;
        var seriesWindGust = wind.series.push(new am4charts.LineSeries());
        seriesWindGust.dataFields.valueY = "wg";
        seriesWindGust.dataFields.dateX = "ot";
        seriesWindGust.tooltipText = "Gust {wg} km/h";
        seriesWindGust.strokeWidth = 1.2;
        seriesWindGust.stroke = am4core.color("#ffbf8d");
        seriesWindGust.tooltip.getFillFromObject = false;
        seriesWindGust.tooltip.background.fill = am4core.color("#ffbf8d");
        seriesWindGust.tooltip.label.fill = am4core.color("#000");
        seriesWindGust.tensionY = 1;
        seriesWindGust.tensionX = 0.8;
        var seriesWinAvg = wind.series.push(new am4charts.LineSeries());
        seriesWinAvg.dataFields.valueY = "was";
        seriesWinAvg.dataFields.dateX = "ot";
        seriesWinAvg.tooltipText = "Avg {was} km/h";
        seriesWinAvg.strokeWidth = 1.2;
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
        seriesRain.dataFields.valueY = "rd";
        seriesRain.dataFields.dateX = "ot";
        seriesRain.tooltipText = "{rd} mm";
        seriesRain.strokeWidth = 1.2;
        seriesRain.tensionY = 1;
        seriesRain.tensionX = 0.8;
        var seriesRainRate = rain.series.push(new am4charts.LineSeries());
        seriesRainRate.dataFields.valueY = "rr";
        seriesRainRate.dataFields.dateX = "ot";
        seriesRainRate.tooltipText = "{rr} mm/h";
        seriesRainRate.strokeWidth = 1.2;
        seriesRainRate.tensionY = 1;
        seriesRainRate.tensionX = 0.8;
        rain.cursor = new am4charts.XYCursor();

        // Create pressure series
        var seriesPressure = pressure.series.push(new am4charts.LineSeries());
        seriesPressure.dataFields.valueY = "p";
        seriesPressure.dataFields.dateX = "ot";
        seriesPressure.tooltipText = "{p} hPa";
        seriesPressure.strokeWidth = 1.2;
        seriesPressure.tensionY = 1;
        seriesPressure.tensionX = 0.8;
        pressure.cursor = new am4charts.XYCursor();

        // Create solar series
        var seriesSolar = solar.series.push(new am4charts.LineSeries());
        seriesSolar.dataFields.valueY = "sr";
        seriesSolar.dataFields.dateX = "ot";
        seriesSolar.tooltipText = "{sr} W/m²";
        seriesSolar.strokeWidth = 1.2;
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
        seriesUV.dataFields.dateX = "ot";
        seriesUV.tooltipText = "{UV}";
        seriesUV.strokeWidth = 1.2;
        seriesUV.stroke = am4core.color("#ffdf43");
        seriesUV.tooltip.getFillFromObject = false;
        seriesUV.tooltip.background.fill = am4core.color("#ffdf43");
        seriesUV.tooltip.label.fill = am4core.color("#000");
        seriesUV.tensionY = 1;
        seriesUV.tensionX = 0.8;
        uv.cursor = new am4charts.XYCursor();

        // Create windir series
        var seriesWindDir = wd.series.push(new am4charts.LineSeries());
        seriesWindDir.dataFields.valueY = "wd";
        seriesWindDir.dataFields.dateX = "ot";
        seriesWindDir.tooltipText = "{wd}° / {wdce} current";
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
        seriesWindDirAvg.dataFields.valueY = "wda";
        seriesWindDirAvg.dataFields.dateX = "ot";
        seriesWindDirAvg.tooltipText = "{wda}° / {wdae} average";
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
        circleBulletWS.tooltipText = "{ws} km/h @ {wd}° {wdce}";
        circleBulletWS.radius = 3;
        circleBulletWS.strokeWidth = 1;
        windspeed.strokeOpacity = 0;
        windspeed.dataFields.valueX = "wd";
        windspeed.dataFields.valueY = "ws";
        windspeed.name = "Speed";
        windspeed.sequencedInterpolation = true;
        windspeed.sequencedInterpolationDelay = 10;
        windspeed.data = winddat;
        windspeed.fill = am4core.color("#15dbac");


        var windgust = windrose.series.push(new am4charts.RadarSeries());
        var circleBulletWG = windgust.bullets.push(new am4core.Circle());
        circleBulletWG.tooltipText = "{wg} km/h @ {wd}° {wdce}";
        circleBulletWG.radius = 3;
        circleBulletWG.strokeWidth = 1;
        windgust.strokeOpacity = 0;
        windgust.dataFields.valueX = "wd";
        windgust.dataFields.valueY = "wg";
        windgust.name = "Gust";
        windgust.sequencedInterpolation = true;
        windgust.sequencedInterpolationDelay = 10;
        windgust.data = winddat;
        windgust.fill = am4core.color("#8fbfbf");

        var windAvg = windrose.series.push(new am4charts.RadarSeries());
        var circleBulletWA = windAvg.bullets.push(new am4core.Circle());
        circleBulletWA.tooltipText = "{was} km/h @ {wd}° {wdce}";
        circleBulletWA.radius = 3;
        circleBulletWA.strokeWidth = 1;
        windAvg.strokeOpacity = 0;
        windAvg.dataFields.valueX = "wd";
        windAvg.dataFields.valueY = "was";
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
            // categoryAxis.dataFields.category = "wdce";
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
            xAxisRR.min = 1;
            // yAxis.renderer.labels.template.verticalCenter = "bottom";
            // yAxis.renderer.labels.template.horizontalCenter = "right";
            // yAxis.renderer.maxLabelPosition = 01;
            // yAxis.renderer.labels.template.paddingBottom = 1;
            // yAxis.renderer.labels.template.paddingRight = 3;
            // yAxis.renderer.minGridDistance = 20;


            /* Create and configure series */
            var rainRate = rainrose.series.push(new am4charts.RadarSeries());
            var circleBulletRR = rainRate.bullets.push(new am4core.Circle());
            circleBulletRR.tooltipText = "{rr} mm/h from {wda}° {wdae}";
            circleBulletRR.radius = 3;
            circleBulletRR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            rainRate.strokeOpacity = 0;
            rainRate.dataFields.valueX = "wda";
            rainRate.dataFields.valueY = "rr";
            rainRate.name = "Rain Rate";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            rainRate.data = raindat;
            rainRate.fill = am4core.color("#ffffff");
        }

        if (h < 2) {
            var tempRose = am4core.create("chartTR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "wdEng";
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
            circleBulletTR.tooltipText = "{tmn} °C from {wda}° {wdae}";
            circleBulletTR.radius = 3;
            circleBulletTR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            tempd.strokeOpacity = 0;
            tempd.dataFields.valueX = "wda";
            tempd.dataFields.valueY = "tmn";
            tempd.name = "Temp Min";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            tempd.data = objdat;
            tempd.fill = am4core.color("#0ec7ff");

            var tempMd = tempRose.series.push(new am4charts.RadarSeries());
            var circleBulletTmR = tempMd.bullets.push(new am4core.Circle());
            circleBulletTmR.tooltipText = "{tmx} °C from {wda}° {wdae}";
            circleBulletTmR.radius = 3;
            circleBulletTmR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            tempMd.strokeOpacity = 0;
            tempMd.dataFields.valueX = "wda";
            tempMd.dataFields.valueY = "tmx";
            tempMd.name = "Temp Max";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            tempMd.data = objdat;
            tempMd.fill = am4core.color("#ff2955");
            tempRose.legend = new am4charts.Legend();
            tempRose.cursor = new am4charts.RadarCursor();

            var pressR = am4core.create("chartPR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "wdce";
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
            circleBulletPR.tooltipText = "{p} hPa from {wda}° {wdae}";
            circleBulletPR.radius = 3;
            circleBulletPR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            pressD.strokeOpacity = 0;
            pressD.dataFields.valueX = "wda";
            pressD.dataFields.valueY = "p";
            pressD.name = "Pressure";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            pressD.data = objdat;
            pressD.fill = am4core.color("#43fff9");
            pressR.legend = new am4charts.Legend();
            pressR.cursor = new am4charts.RadarCursor();

            var humRose = am4core.create("chartHR", am4charts.RadarChart);
            // var categoryAxis = windrose.xAxes.push(new am4charts.CategoryAxis());
            // categoryAxis.dataFields.category = "wdce";
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
            yAxisHR.min = 0;
            yAxisHR.max = 100;
            // yAxis.renderer.labels.template.verticalCenter = "bottom";
            // yAxis.renderer.labels.template.horizontalCenter = "right";
            // yAxis.renderer.maxLabelPosition = 01;
            // yAxis.renderer.labels.template.paddingBottom = 1;
            // yAxis.renderer.labels.template.paddingRight = 3;
            // yAxis.renderer.minGridDistance = 20;


            /* Create and configure series */
            var humd = humRose.series.push(new am4charts.RadarSeries());
            var circleBulletHR = humd.bullets.push(new am4core.Circle());
            circleBulletHR.tooltipText = "{ho} % from {wda}° {wdae}";
            circleBulletHR.radius = 3;
            circleBulletHR.strokeWidth = 1;
            // rainRate.minBulletDistance = 1.5;
            humd.strokeOpacity = 0;
            humd.dataFields.valueX = "wda";
            humd.dataFields.valueY = "ho";
            humd.name = "Humidity";
            // rainRate.sequencedInterpolation = true;
            // rainRate.sequencedInterpolationDelay = 10;
            humd.data = objdat;
            humd.fill = am4core.color("#43fff9");
            humRose.legend = new am4charts.Legend();
            humRose.cursor = new am4charts.RadarCursor();
        }
    }
});