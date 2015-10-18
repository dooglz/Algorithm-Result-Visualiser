var Chart = Chart || {};

Chart.Construct = function (chartDiv) {
  Chart.chartDiv  = d3.select("#chartDiv");
  Chart.$chartDiv  = $("#chartDiv");
  Chart.species = ["setosa", "versicolor", "virginica"],
  Chart.paddingTop = 80;
  Chart.paddingBottom = 80;
  Chart.paddingRight = 100;
  Chart.paddingLeft= 100;
  Chart.width = Chart.$chartDiv.width() -  Chart.paddingRight - Chart.paddingLeft;
  Chart.height = Chart.$chartDiv.height() - Chart.paddingTop - Chart.paddingBottom;
  Chart.xScale = {};
  Chart.yScale = {};
  Chart.line = d3.svg.line();
  Chart.axis = d3.svg.axis().orient("left");
  Chart.foreground = {};
  Chart.svg = Chart.chartDiv
    .append("svg:svg")
    .attr("width", Chart.width +  Chart.paddingRight + Chart.paddingLeft)
    .attr("height", Chart.height + Chart.paddingTop + Chart.paddingBottom)
    .append("svg:g")
    .attr("transform", "translate(" + Chart.paddingLeft + "," + Chart.paddingTop + ")");
} ("#chartDiv");

Chart.Destruct = function () {
  Chart.species = [],
  Chart.Events = [];
  Chart.m = [];
  Chart.width = 0;
  Chart.height = 0;
  Chart.xScale = {};
  Chart.yScale = {};
  Chart.line = {};
  Chart.axis = {};
  Chart.foreground = {};
  d3.select("svg").remove();
  Chart.svg = null;
}



Chart.ChangeData = function (data) {
  Chart.data = data;
  Chart.Events = data.events;
  Chart.xScale = d3.scale.ordinal().domain(Chart.Events).rangePoints([0, Chart.width]);
  Chart.yScale = {};
  console.log(data);
  // Create a scale and brush for each event.
  for (var i = 0; i < data.events.length; i++) {
    var e = data.events[i];
    Chart.yScale[e] = d3.scale.linear()
      .domain(d3.extent(data.eventTimes, function (p) { return p[i]; }))
      .range([Chart.height, 0]);

    Chart.yScale[e].brush = d3.svg.brush()
      .y(Chart.yScale[e])
      .on("brush", Chart.brush);
  }

  // Add foreground lines.
  Chart.foreground = Chart.svg.append("svg:g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data.d3data)
    .enter().append("svg:path")
    .attr("d", Chart.path)
    .attr("class", "setosa");

  // Add a group element for each event.
  var g = Chart.svg.selectAll(".event")
    .data(Chart.Events)
    .enter().append("svg:g")
    .attr("class", "event")
    .attr("transform", function (d) { return "translate(" + Chart.xScale(d) + ")"; })
    .call(d3.behavior.drag()
      .origin(function (d) { return { x: Chart.xScale(d) }; })
      .on("dragstart", dragstart)
      .on("drag", drag)
      .on("dragend", dragend));

  // Add an axis and title.
  var axises =  g.append("svg:g")
    .attr("class", "axis")
    .each(function (d) { d3.select(this).call(Chart.axis.scale(Chart.yScale[d])); });
 
    axises.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", -9)
    .text(String);
    axises.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", Chart.height+20)
    .text(String);
  // Add a brush for each axis.
  /*
  g.append("svg:g")
    .attr("class", "brush")
    .each(function (d) { d3.select(this).call(Chart.yScale[d].brush); })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);
    */
  function dragstart(d) {
    i = Chart.Events.indexOf(d);
  }

  function drag(d) {
    x.range()[i] = d3.event.x;
    Chart.Events.sort(function (a, b) { return x(a) - x(b); });
    g.attr("transform", function (d) { return "translate(" + x(d) + ")"; });
    Chart.foreground.attr("d", Chart.path);
  }

  function dragend(d) {
    x.domain(Chart.Events).rangePoints([0, w]);
    var t = d3.transition().duration(500);
    t.selectAll(".event").attr("transform", function (d) { return "translate(" + x(d) + ")"; });
    t.selectAll(".foreground path").attr("d", path);
  }
}


// Returns the path for a given data point.
Chart.path = function (d) {
  return Chart.line(Chart.Events.map(function (p) { return [Chart.xScale(p), Chart.yScale[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
Chart.brush = function () {
  var actives = Chart.Events.filter(function (p) { return !Chart.yScale[p].brush.empty(); });
  var extents = actives.map(function (p) { return Chart.yScale[p].brush.extent(); });
  Chart.foreground.classed("fade", function (d) {
    return !actives.every(function (p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    });
  });
}

Chart.ChangeData(DataParser.Combine([sample1,sample2,sample3]));