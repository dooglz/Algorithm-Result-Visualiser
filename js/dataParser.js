var DataParser = DataParser || {};


var sample1 = {
  tests: ["sample1"],
  eventTimes: [0,5,10],
  events: ["Start","Middle","End"],
}
var sample2 = {
  tests: ["sample2"],
  eventTimes: [0,2,10],
  events: ["Start","Middle","End"],
}
var sample3 = {
  tests: ["sample3"],
  eventTimes: [0,6,10],
  events: ["Start","Middle","End"],
}

DataParser.ParseCSV = function (rawCSV) {
  var obj = {};
  obj.tests = [];
  obj.events = [];
  obj.events.push("Start");
  obj.events.push("Middle");
  obj.events.push("End");
  obj.eventTimes = [[0],[5],[10]];
  return obj;
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
    Horizontal2DMerge(obj.eventTimes,testData[i].eventTimes);
    
    var d3d  = {name:testData[i].tests[0]};
    //verify events
    for (var j = 0; j < testData[i].events.length; j++) {
      if ($.inArray(testData[i].events[j], obj.events) != j) {
        console.error("comparing Tests with different events!");
      }
      d3d[testData[i].events[j]] = testData[i].eventTimes[j];
    }
     obj.d3data.push(d3d);
  }
  return obj;
}
