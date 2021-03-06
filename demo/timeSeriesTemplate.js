
var rawdata;
if (rawdata.length < 3) {
    console.log("ERROR: Must lable axis.");
}
var box_width = Math.round(dim.width - 2 * dim.margin);
var box_height = Math.round(box_width * 440 / 800);
var margin = {top: 20, right: 80, bottom: 35, left: 80};
var width = box_width - margin.left - margin.right;
var height = box_height - margin.top - margin.bottom;
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var color = d3.scale.category10();
var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); });
var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("display", "block")
        .attr("style", "margin: auto")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
color.domain(d3.keys(rawdata[0]).filter(function(key) { return key !== "date"; }));
rawdata.forEach(function(d) {
    d.date = new Date(d.date);
});
var cities = color.domain().map(function(name) {
    return {
        name: name,
        values: rawdata.map(function(d) {
            return {date: d.date, value: +d[name]};
        })
    };
});
x.domain(d3.extent(rawdata, function(d) { return d.date; }));
y.domain([
    d3.min(cities, function(c) {
        return d3.min(c.values, function(v) { return v.value; });
    }),
    d3.max(cities, function(c) {
        return d3.max(c.values, function(v) { return v.value; });
    })
]);
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width/2 - 10)
    .attr("y", margin.bottom - 5)
    .text(xTitle)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(90)")
    .style("text-anchor", "start");
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left/2)
    .attr("x",0 - (height / 2))
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text(yTitle);
svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis
          .tickSize(-height, 0, 0)
          .tickFormat("")
          .ticks(60));
svg.append("g")
    .attr("class", "grid")
    .call(yAxis
          .tickSize(-width, 0, 0)
          .tickFormat("")
          .ticks(60));
var city = svg.selectAll(".city")
        .data(cities)
        .enter().append("g")
        .attr("class", "city");
city.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });
city.append("text")
    .datum(function(d) {
        return {name: d.name, value: d.values[d.values.length - 1]};
    })
    .attr("transform", function(d) {
        return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")";
    })
    .attr("x", 3)
    .attr("dy", ".35em")
    .text(function(d) { return d.name; });
