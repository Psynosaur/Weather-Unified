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

am5.ready(function () {
    var pageData = objdata;
    var timeFrame = hrs;
    var winddat = winddata;
    var raindat = raindata;

    // This changes based on variable timeFrame
    let tUnint = "minute";
    let dateFormat = "HH:mm";
    let baseIntervalCount = 5;
    let gridCount = 180;
    switch (timeFrame) {
        case 1:
            tUnint = "minute";
            baseIntervalCount = 5;
            gridCount = 120
            break;
        case 2:
            tUnint = "hour"
            dateFormat = "dd-MM HH:mm";
            baseIntervalCount = 1;
            gridCount = 24
            break;
        case 3:
            tUnint = "hour"
            dateFormat = "dd-MM HH:mm";
            baseIntervalCount = 2;
            gridCount = 48;
            break;
        default:
            tUnint = "second";
            baseIntervalCount = 30;
            gridCount = 600
    }
    // These are the steps to setup a XY line chart in amcharts 5

    // 1. Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    // 2. Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    // 3. Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    // 4. Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    // 5. Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    // 6. Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    // 7. Set data

    function createXYChart({
                               id,
                               valueFields,
                               tooltipText,
                               strokeFillColors,
                               labelText,
                               min,
                               max,
                               bullets,
                               connected,
                               strokeWidth,
                               fps
                           } = {}) {
        // 1. Create root element
        var root = am5.Root.new(id);
        root.fps = fps;
        // 2. Set themes
        root.setThemes([
            am5themes_Dark.new(root)
        ]);
        // 3. Create chart
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            pinchZoomX: true,
        }));
        // 4. Add cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
            behavior: "zoomX"
        }));
        cursor.lineY.set("visible", false);
        // 5. Create axes
        // Temperature and aew chart axes
        var xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                maxDeviation: 0.5,
                baseInterval: {
                    timeUnit: tUnint,
                    count: baseIntervalCount
                },
                gridIntervals: [
                    {timeUnit: tUnint, count: gridCount}
                ],
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 60,
                }),
                tooltip: am5.Tooltip.new(root, {})
            }));
        // xAxis.get("dateFormats")[tUnint] = dateFormat;
        // var xRenderer = xAxis.get("renderer");
        // xRenderer.grid.template.setAll({
        //     location: 0
        // });

        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: min,
                max: max,
                strictMinMax: true,
                renderer: am5xy.AxisRendererY.new(root, {
                    minGridDistance: 30,
                    strokeWidth: 1.2
                })
            }));

        // 6. Add series
        for (let i = 0; i < valueFields.length; i++) {
            var series = chart.series.push(
                am5xy.SmoothedXLineSeries.new(root, {
                    name: `Series${id}${i}`,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: valueFields[i],
                    valueXField: "ot",
                    tooltip: am5.Tooltip.new(root, {
                        labelText: tooltipText[i],
                        getFillFromObject: false
                    }),
                    fill: am5.color(strokeFillColors[i]),
                    stroke: am5.color(strokeFillColors[i]),
                    tension: 0.8,
                })
            );
            chart.children.unshift(am5.Label.new(root, {
                text: labelText,
                fontSize: 14,
                textAlign: "center",
                x: am5.percent(50),
                centerX: am5.percent(50)
            }));
            if (bullets) {
                // let fill = series.get("fill");
                series.bullets.push(function (root) {
                    return am5.Bullet.new(root, {
                        sprite: am5.Circle.new(root, {
                            radius: 1.4,
                            fill: am5.color(strokeFillColors[i])
                        })
                    })
                });
                series.strokes.template.setAll({
                    strokeDasharray: [0, 1],
                });

            }
            series.data.setAll(pageData);
        }
    }

    function createPolarChart({
                                  id,
                                  valueYFields,
                                  tooltipText,
                                  strokeFillColors,
                                  valueXFields,
                                  min,
                                  max,
                                  data,
                                  strokeWidth,
                                  fps,
                                  seriesNames,
                                  showLegend,
                              } = {}) {
        var root = am5.Root.new(id);
        root.fps = fps;
        root.setThemes([
            am5themes_Dark.new(root)
        ]);

        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none"
        }));

        var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
            behavior: "none"
        }));

        cursor.lineY.set("visible", false);
        cursor.lineX.set("visible", false);

        var xRenderer = am5radar.AxisRendererCircular.new(root, {
            minGridDistance: 40
        });
        xRenderer.grid.template.setAll({
            location: 0,
            maxLabelPosition: 0.99
        });
        var xAxis = chart.xAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0,
                min: min,
                max: max,
                strictMinMax: true,
                renderer: xRenderer
            }));

        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                min: 1,
                renderer: am5radar.AxisRendererRadial.new(root, {})
            }));

        for (let i = 0; i < valueYFields.length; i++) {
            var series = chart.series.push(am5radar.RadarLineSeries.new(root, {
                name: seriesNames ? seriesNames[i] : `Series${id}${i}`,
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: valueYFields[i],
                valueXField: valueXFields[i],
                tooltip: am5.Tooltip.new(root, {
                    labelText: tooltipText[i]
                }),
                connectEnds: false,
                sequencedInterpolation: true,
                sequencedInterpolationDelay: 10
            }));
            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    sprite: am5.Circle.new(root, {
                        radius: 4,
                        fill: am5.color(strokeFillColors[i]),
                        strokeWidth: strokeWidth,
                        stroke: root.interfaceColors.get("background")
                    })
                })
            })
            
            if(showLegend){
                var legend = chart.children.push(am5.Legend.new(root, {}));
                legend.data.setAll(chart.series.values);
            }
            series.strokes.template.setAll({
                strokeDasharray: [0, 1],
                color: strokeFillColors[i]
            });


            series.data.setAll(data);
            xAxis.data.setAll(data);
        }
    }


    createXYChart({
            id: "chartemp",
            valueFields: ["to", "dc"],
            tooltipText: ["Outdoor {to} °C", "Dew Point {dc} °C"],
            strokeFillColors: ["#ff8145", "#87f7ff"],
            labelText: "Temp & Dew point",
            fps: 60
        }
    );
    createXYChart(
        {
            id: "chartminmax",
            valueFields: ["tmn", "tmx"],
            tooltipText: ["{tmn} °C min", "{tmx} °C max"],
            strokeFillColors: ["#0ec7ff", "#ff2955"],
            labelText: "Temp Min/Max",
            fps: 60
        }
    );
    createXYChart(
        {
            id: "charthum",
            valueFields: ["ho", "hi"],
            tooltipText: ["Outdoors {ho} %", "Indoors {hi} %"],
            strokeFillColors: ["#5c8fff", "#0ec7ff"],
            labelText: "Humidity",
            fps: 60
        }
    );
    createXYChart(
        {
            id: "chartpressure",
            valueFields: ["p"],
            tooltipText: ["{p} hPa"],
            strokeFillColors: ["#ff8d8d"],
            labelText: "Pressure",
            fps: 60
        }
    );
    createXYChart(
        {
            id: "chartwind",
            valueFields: ["ws", "wg", "was"],
            tooltipText: ["Current {ws} km/h", "Gust {wg} km/h", "Avg {was} km/h"],
            strokeFillColors: ["#11ff1e", "#ffbf8d", "#ff8d8d"],
            labelText: "Wind Speed",
            fps: 60,
            min: 0
        }
    );
    createXYChart(
        {
            id: "chartrain",
            valueFields: ["rd", "rr"],
            tooltipText: ["{rd} mm", "{rr} mm/h from {wda}° {wdae}"],
            strokeFillColors: ["#5c8fff", "#87f7ff"],
            labelText: "Rain",
            fps: 60,
            min: 0
        }
    );
    createXYChart(
        {
            id: "chartsolar",
            valueFields: ["sr"],
            tooltipText: ["{sr} W/m²"],
            strokeFillColors: ["#ffdf43"],
            labelText: "Radiation",
            fps: 60,
            min: 0
        }
    );
    createXYChart(
        {
            id: "chartuv",
            valueFields: ["UV"],
            tooltipText: ["{UV}"],
            strokeFillColors: ["#ffdf43"],
            labelText: "UV index",
            fps: 60,
            min: 0
        }
    );
    createXYChart(
        {
            id: "chartwd",
            valueFields: ["wd", "wda"],
            tooltipText: ["{wd}° / {wdce} current", "{wda}° / {wdae} average"],
            strokeFillColors: ["#7fdfff", "#dafaff"],
            labelText: "Wind Direction",
            min: 0,
            max: 360,
            bullets: true,
            connected: false,
            strokeWidth: 0,
            fps: 60
        }
    );
    createPolarChart({
        id: "windrose",
        valueYFields: ["wg", "was"],
        strokeFillColors: ["#ffdf43", "#8ebdf3"],
        tooltipText: ["{wg} km/h @ {wd}° {wdce}", "{was} km/h @ {wd}° {wdce}"],
        valueXFields: ["wd", "wd"],
        min: 0,
        max: 360,
        data: winddat,
        strokeWidth: 0.5,
        fps: 60,
        seriesNames: ["Gust", "Average"],
        showLegend: true
    })
    if (raindat) {
        createPolarChart({
            id: "rainrose",
            valueYFields: ["rr"],
            strokeFillColors: ["#8ebdf3"],
            tooltipText: ["{ot} : {rr} mm/h from {wda}° {wdae}"],
            min: 0,
            max: 360,
            valueXFields: ["wda"],
            data: raindat,
            strokeWidth: 0.5,
            fps: 60,
            showLegend: false
        })
    }
    // if (timeFrame < 2) {
    //     // var setCanvasSize = function() {
    //     //     canvas.width = 400;
    //     //     canvas.height = 400;
    //     // }
    //     // setCanvasSize();
    //     createPolarChart({
    //         id: "chartTR",
    //         valueYFields: ["tmn", "tmx"],
    //         strokeFillColors: ["#ffdf43", "#8ebdf3"],
    //         tooltipText: ["{tmn} °C from {wda}° {wdae}", "{tmx} °C from {wda}° {wdae}"],
    //         valueXFields: ["wda", "wda"],
    //         min: 0,
    //         max: 360,
    //         data: pageData,
    //         strokeWidth: 0.5,
    //         fps: 60
    //     })
    //     createPolarChart({
    //         id: "chartPR",
    //         valueYFields: ["p"],
    //         strokeFillColors: ["#ffdf43"],
    //         tooltipText: ["{p} hPa from {wda}° {wdae}"],
    //         valueXFields: ["wda"],
    //         min: 0,
    //         max: 360,
    //         data: pageData,
    //         strokeWidth: 0.5,
    //         fps: 60
    //     })
    //     createPolarChart({
    //         id: "chartHR",
    //         valueYFields: ["ho"],
    //         strokeFillColors: ["#ffdf43"],
    //         tooltipText: ["{ho} % from {wda}° {wdae}"],
    //         valueXFields: ["wda"],
    //         min: 0,
    //         max: 360,
    //         data: pageData,
    //         strokeWidth: 0.5,
    //         fps: 60
    //     })
    // }

    // REMOVE ME!!!!
    console.log(`timeFrame : ${timeFrame}\ntimeUnit : ${tUnint},\ndateFormat : ${dateFormat}\nCount : ${baseIntervalCount}`)
});