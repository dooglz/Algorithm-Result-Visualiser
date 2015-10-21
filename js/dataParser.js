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
      if (IsNumber(headder[i])) {
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
      console.warn("Parsing csv, unkown line: ", headers);
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
  if (!$.isArray(testData) || testData.length == 0) {
    return null;
  }
  var obj = {};
  obj.tests = [];
  obj.events = testData[0].events;
  obj.eventTimes = [];
  obj.d3data = [];

  var cp = testData;
  //before we do anything, check comaptability.
  for (var i = 1; i < testData.length; i++) {
    for (var j = 0; j < testData[i].events.length; j++) {
      if ($.inArray(testData[i].events[j], obj.events) != j) {
        console.error("comparing Tests with different events!");
        testData.splice(i, 1);
        i--;
      }
    }
  }

  for (var i = 0; i < testData.length; i++) {
    //basically jsut test names
    obj.tests = obj.tests.concat(testData[i].tests);
    //merge all the event tiem arryas into one
    Horizontal2DMerge(obj.eventTimes, testData[i].eventTimes)
    var d3d = { name: testData[i].tests[0] };
    //verify events
    for (var j = 0; j < testData[i].events.length; j++) {
      d3d[testData[i].events[j]] = testData[i].eventTimes[j];
    }
    obj.d3data.push(d3d);
  }
  return obj;
}

DataParser.DataNameToObj = function (dataname) {
  var days = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  var n = -1;
  var ret = { id: dataname, date: new Date(), name: dataname };
  for (var i = 0; i < days.length; i++) {
    n = dataname.indexOf(days[i]);
    if (n != -1) {
      break;
    }
  }
  if (n != -1) {
    var d = dataname.substring(n, dataname.length - 4);
    ret.date = new Date(d.replace(/_/g, " ").replace(/-/g, ":"));
    ret.name = dataname.substring(0, n - 1);
  } else {
    console.warn("Couldn't parse filename", dataname)
  }
  return ret;
}
