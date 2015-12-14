var Chart = Chart || {};

var c10 = d3.scale.category10();

Chart.Construct = function (chartDiv) {
  Chart.chartDiv = d3.select("#chartDiv");
  Chart.$chartDiv = $("#chartDiv");
  Chart.species = ["setosa", "versicolor", "virginica"],
  Chart.paddingTop = 20;
  Chart.paddingBottom = 50;
  Chart.paddingRight = 100;
  Chart.paddingLeft = 100;
  Chart.width = Chart.$chartDiv.width() - Chart.paddingRight - Chart.paddingLeft;
  Chart.height = Chart.$chartDiv.height() - Chart.paddingTop - Chart.paddingBottom;
  Chart.xScale = {};
  Chart.yScale = {};
  Chart.line = d3.svg.line();
  Chart.axis = d3.svg.axis().orient("left");
  Chart.axisMid = d3.svg.axis().orient("left").ticks(0);
  Chart.axisEnd = d3.svg.axis().orient("right");
  Chart.foreground = {};
  Chart.svg = Chart.chartDiv
    .append("svg:svg")
    .attr("width", Chart.width + Chart.paddingRight + Chart.paddingLeft)
    .attr("height", Chart.height + Chart.paddingTop + Chart.paddingBottom)
    .append("svg:g")
    .attr("transform", "translate(" + Chart.paddingLeft + "," + Chart.paddingTop + ")");
    
    Chart.Tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    
}; //("#chartDiv");

Chart.Destruct = function () {
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
  Chart.Destruct();
  if(!Exists(data)){
    return;
  }
  Chart.Construct("#chartDiv");
  Chart.data = data;
  Chart.Events = data.events;
  Chart.xScale = d3.scale.ordinal().domain(Chart.Events).rangePoints([0, Chart.width]);
  Chart.yScale = {};
  console.log(data);
  // Create a scale and brush for each event.
  
  for (var i = 0; i < data.events.length; i++) {
    var e = data.events[i];
    Chart.yScale[e] = d3.scale.linear()
    //.domain(d3.extent(data.eventTimes[i]))
      .domain(data.timeExtent)
      .range([Chart.height, 0])
      .clamp(true);
  }

  // Add foreground lines.
  Chart.foreground = Chart.svg.append("svg:g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data.d3data)
    .enter().append("svg:path")
    .attr("d", Chart.path)
    .attr("stroke", function (d,i){return c10(i);} );
    //.attr("class", "setosa");

  // Add a group element for each event.
  var g = Chart.svg.selectAll(".event")
    .data(Chart.Events)
    .enter().append("svg:g")
    .attr("class", "event")
    .attr("transform", function (d) { return "translate(" + Chart.xScale(d) + ")"; })
    
  // Add an axis and title.
  var axises = g.append("svg:g")
    .attr("class", "axis")
    .each(function (d, i) {
      if (i == 0) {
        d3.select(this).call(Chart.axis.scale(Chart.yScale[d]));
      } else if (i == Chart.Events.length - 1) {
        d3.select(this).call(Chart.axisEnd.scale(Chart.yScale[d]));
      } else {
        d3.select(this).call(Chart.axisMid.scale(Chart.yScale[d]));
      }
    });

  axises.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", -9)
    .text(String);
  axises.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", function (d,i){return Chart.height + 20 + (i%3)*15;})
    .text(String);
    
  axises.on("mouseover", $.proxy(function (d) {
      d3.select(this).attr("class", "axis red" );
      d3.select(this).selectAll("text").attr("fill", "red" );
      Chart.Tooltip.transition().duration(200).style("opacity", .9);
      Chart.Tooltip.html(d).style("left",(d3.event.pageX) + "px").style("top",(d3.event.pageY - 28) + "px");
    }));
    axises.on("mouseout", $.proxy(function (d) {
      d3.select(this).attr("class", "axis" );
      d3.select(this).selectAll("text").attr("fill", "black" );
     Chart.Tooltip.transition().duration(500).style("opacity", 0);
    }));
}


// Returns the path for a given data point.
Chart.path = function (d) {
  return Chart.line(Chart.Events.map(function (p) { return [Chart.xScale(p), Chart.yScale[p](d[p])]; }));
}

//Chart.ChangeData(DataParser.Combine([sample1,sample2,sample3]));

var csv1;
var csv2;
//d3.text("test.csv", function (d) { csv1 = DataParser.ParseCSV(d); d3.text("test2.csv", function (d) { csv2 = DataParser.ParseCSV(d); Chart.ChangeData(DataParser.Combine([csv1, csv2])); }); });
