var DataParser = DataParser || {};


var sample1 = {
  tests: ["sample1"],
  eventTimes: [0, 5, 10],
  events: ["Start", "Middle", "End"],
}
var sample2 = {
  tests: ["sample2"],
  eventTimes: [0, 2, 10],
  events: ["Start", "Middle", "End"],
}
var sample3 = {
  tests: ["sample3"],
  eventTimes: [0, 6, 10],
  events: ["Start", "Middle", "End"],
}

DataParser.ParseCSV = function (csv) {
  var ParseHeadder = function (headder) {
    for (var i = 0; i < headder.length; i++) {
      headder[i] = Sanitise(headder[i]);
      if(IsNumber(headder[i])){
        headder[i] = +headder[i];
      }
    }
    if (Empty(headder[headder.length - 1])) {
      headder.pop();
    }
    return headder;
  };
  
  var lines = csv.split("\n");
  var result = {};
  var i;
  for (i = 0; i < lines.length; i++) {
    var headers = ParseHeadder(lines[i].split(","));
    if (headers.length == 0) {
      continue;
    } else if (headers.length == 1) {
      console.warn("Parsing csv, unkown line: ", lines);
    } else if (headers[0] == "Run") {
      break;
    } else if (headers.length == 2) {
      result[Sanitise(headers[0])] = Sanitise(headers[1]);
    }
  }
  result.tests = [result.name];
  result.events = ParseHeadder(lines[i].split(","));
  result.events[0] = "Start";
  result.eventTimes = ParseHeadder(lines[i + 1].split(","));
  result.eventTimes[0] = 0;
  cumulative(result.eventTimes);
  return result;
}

DataParser.Combine = function (testData) {
  if (!$.isArray(testData) || testData.length == 1) {
    return testData;
  }
  var obj = {};
  obj.tests = [];
  obj.events = testData[0].events;
  obj.eventTimes = [];
  obj.d3data = [];
  for (var i = 0; i < testData.length; i++) {
    obj.tests = obj.tests.concat(testData[i].tests);
    Horizontal2DMerge(obj.eventTimes, testData[i].eventTimes);

    var d3d = { name: testData[i].tests[0] };
    //verify events
    for (var j = 0; j < testData[i].events.length; j++) {
      if ($.inArray(testData[i].events[j], obj.events) != j) {
        console.error("comparing Tests with different events!");
        return {};
      }
      d3d[testData[i].events[j]] = testData[i].eventTimes[j];
    }
    obj.d3data.push(d3d);
  }
  return obj;
}
