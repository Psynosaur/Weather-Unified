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

    // This changes based on variable timeFrame
    let tUnint = "minute";
    let dateFormat = "HH:mm";
    let baseIntervalCount = 5;
    let gridCount = 180;
    switch (timeFrame) {
        case 1:
            tUnint = "minute";
            gridCount = 60
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
                              strokeWidth
                          } = {}) {
        // 1. Create root element
        var root = am5.Root.new(id);
        // 2. Set themes
        root.setThemes([
            am5themes_Dark.new(root)
        ]);
        // 3. Create chart
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
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
                    strokeWidth: strokeWidth,
                    connect: connected
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
                let fill = series.get("fill");
                series.bullets.push(function (root) {
                    return am5.Bullet.new(root, {
                        sprite: am5.Circle.new(root, {
                            radius: 2,
                            fill: fill
                        })
                    })
                });

            }
            series.data.setAll(pageData);
        }
    }
    
    function createPolarChart({
                                  id,
                                  valueFields,
                                  tooltipText,
                                  strokeFillColors,
                                  labelText,
                                  min,
                                  max,
                                  bullets,
                                  connected,
                                  strokeWidth
                              } = {}) {
        var root = am5.Root.new(id);

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([
            am5themes_Dark.new(root)
        ]);



// Create chart
// https://www.amcharts.com/docs/v5/charts/radar-chart/
        var chart = root.container.children.push(am5radar.RadarChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX"
        }));

// Add cursor
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
        var cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
            behavior: "none"
        }));

        cursor.lineY.set("visible", false);
        cursor.lineX.set("visible", false);

// Create axes and their renderers
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
        var xRenderer = am5radar.AxisRendererCircular.new(root, {});
        xRenderer.labels.template.setAll({
            radius: 10
        });

        // var xAxis = chart.xAxes.push(
        //     am5xy.ValueAxis.new(root, {
        //         min: min,
        //         max: max,
        //         strictMinMax: true,
        //         renderer: am5radar.AxisRendererX.new(root, {
        //             minGridDistance: 20,
        //         })
        //     }));
        var xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
            renderer: am5radar.AxisRendererRadial.new(root, {})
        }));
        var yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
            renderer: am5radar.AxisRendererRadial.new(root, {})
        }));

// Create series
// https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series

        var series = chart.series.push(am5radar.RadarLineSeries.new(root, {
            stacked: true,
            name: "Series ",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueFields[0],
            valueXField: "wd",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{wg} km/h @ {wd}° {wdce}"
            })
        }));


        series.strokes.template.set("strokeWidth", 2);
        series.bullets.push(function() {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: series.get("fill"),
                    strokeWidth: 2,
                    stroke: root.interfaceColors.get("background")
                })
            })
        })

        var series1 = chart.series.push(am5radar.RadarLineSeries.new(root, {
            stacked: true,
            name: "Series ",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: valueFields[1],
            valueXField: "wd",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{was} km/h @ {wd}° {wdce}"
            })
        }));


        series1.strokes.template.set("strokeWidth", 2);
        series1.bullets.push(function() {
            return am5.Bullet.new(root, {
                sprite: am5.Circle.new(root, {
                    radius: 5,
                    fill: series1.get("fill"),
                    strokeWidth: 2,
                    stroke: root.interfaceColors.get("background")
                })
            })
        })
        series.data.setAll(winddat);
        series1.data.setAll(winddat);
        xAxis.data.setAll(winddat);
    }
        

    createXYChart({
            id: "chartemp",
            valueFields: ["to", "dc"],
            tooltipText: ["Outdoor {to} °C", "Dew Point {dc} °C"],
            strokeFillColors: ["#ff8145", "#87f7ff"],
            labelText: "Temp & Dew point"
        }
    );
    createXYChart(
        {
            id: "chartminmax",
            valueFields: ["tmn", "tmx"],
            tooltipText: ["{tmn} °C min", "{tmx} °C max"],
            strokeFillColors: ["#0ec7ff", "#ff2955"],
            labelText: "Temp Min/Max"
        }
    );
    createXYChart(
        {
            id: "charthum",
            valueFields: ["ho", "hi"],
            tooltipText: ["Outdoors {ho} %", "Indoors {hi} %"],
            strokeFillColors: ["#5c8fff", "#0ec7ff"],
            labelText: "Humidity"
        }
    );
    createXYChart(
        {
            id: "chartpressure",
            valueFields: ["p"],
            tooltipText: ["{p} hPa"],
            strokeFillColors: ["#ff8d8d"],
            labelText: "Pressure"
        }
    );
    createXYChart(
        {
            id: "chartwind",
            valueFields: ["ws", "wg", "was"],
            tooltipText: ["Current {ws} km/h", "Gust {wg} km/h", "Avg {was} km/h"],
            strokeFillColors: ["#11ff1e", "#ffbf8d", "#ff8d8d"],
            labelText: "Wind Speed"
        }
    );
    createXYChart(
        {
            id: "chartrain",
            valueFields: ["rd", "rr"],
            tooltipText: ["{rd} mm", "{rr} mm/h from {wda}° {wdae}"],
            strokeFillColors: ["#5c8fff", "#87f7ff"],
            labelText: "Rain",
        }
    );
    createXYChart(
        {
            id: "chartsolar",
            valueFields: ["sr"],
            tooltipText: ["{sr} W/m²"],
            strokeFillColors: ["#ffdf43"],
            labelText: "Radiation"
        }
    );
    createXYChart(
        {
            id: "chartuv",
            valueFields: ["UV"],
            tooltipText: ["{UV}"],
            strokeFillColors: ["#ffdf43"],
            labelText: "UV index"
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
            strokeWidth: 0
        }
    );
    createPolarChart({
        id:"windrose",
        valueFields: ["wg","was"],
        strokeFillColors: ["#71e769", "#8ebdf3"],
        min: 0,
        max: 360,
    })

    // REMOVE ME!!!!
    console.log(`timeFrame : ${timeFrame}\ntimeUnit : ${tUnint},\ndateFormat : ${dateFormat}\nCount : ${baseIntervalCount}`)
});