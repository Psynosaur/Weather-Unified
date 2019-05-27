// Include all modules we need
const svg2png = require("svg2png");
const { JSDOM } = require("jsdom");
const d3 = require('d3');

// https://bl.ocks.org/mbostock/3887235
module.exports = function (callback, options, data) {


    var dom = new JSDOM('<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body><svg width="960" height="500"></svg></body></html>');
    var document = dom.window.document;
    dom.window.d3 = d3.select(dom.window.document);


    // callback(null, dom.window.document.body.innerHTML);


    var svg = dom.window.d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    radius = Math.min(width, height) / 2,
    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");



    var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.population;
        });


    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

    /*
    var dataaa =
        [
            {
                age: "<5",
                population: 2704659
            },
            {
                age: "5-13",
                population: 4499890
            },
            {
                age: "14-17",
                population: 2159981
            },
            {
                age: "18-24",
                population: 3853788
            },
            {
                age: "25-44",
                population: 14106543
            }
            ,
            {
                age: "45-64",
                population: 8819342
            }
            ,
            {
                age: "≥65",
                population: 612463
            }
        ];
    */

        var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function (d) {
            return color(d.data.age);
        });

    arc.append("text")
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        .attr("dy", "0.35em")
        .text(function (d) {
            return d.data.age;
        });
    //});

    // var svgText = dom.window.document.body.outerHTML;
    // var svgText = dom.window.document.body.innerHTML;
    var svgText = dom.window.document.body.querySelector("svg").outerHTML
    // callback(null, svgText);

    // var svgText = dom.window.d3.select("svg").html();
    // svgText=process.version; // v8.6.0
    // svgText= JSON.stringify(process.versions); //
    // var pjson = require('./package.json'); svgText = pjson.version;
    // callback(null, svgText);
    // callback(null, JSON.stringify(  { width: width, height: height } ));

    // var buf = Buffer.from(svgText);
    // callback(null, JSON.stringify( buf ));
    // var output = svg2png.sync(buf, { width: width, height: height } );
    // callback(null, JSON.stringify( output ));
    //callback(null,  svgText);
    // callback(null,  'data:image/svg+xml;base64,' + Buffer.from(svgText).toString('base64'));


    svg2png(Buffer.from(svgText), { width: width, height: height })
        .then(buffer => 'data:image/png;base64,' + buffer.toString('base64') )
        .then(buffer => callback(null, buffer));

}