var DataParser = DataParser || {};

DataParser.MatchingEvents = function (e1,e2) {
  console.log(e1,e2);
  for (var j = 0; j < e1.Run.length; j++) {
    if ($.inArray(e1.Run[j], e2.Run) != j) {
      console.warn()
      return false;
    }
  }
   return true;
}

DataParser.Combine = function (testData) {
  if (!$.isArray(testData) || testData.length == 0) {
    return null;
  }
  console.log(testData);
  var obj = {};
  obj.events = testData[0].Run;
  obj.d3data = [];
  obj.timeExtent = [Number.MAX_SAFE_INTEGER,0];
  
  var cp = testData;
  //before we do anything, check comaptability.
  for (var i = 1; i < testData.length; i++) {
    if (!this.MatchingEvents(testData[0], testData[i])) {
      console.error("comparing Tests with different events!");
      testData.splice(i, 1);
      i--;
    }
  }

  for (var i = 0; i < testData.length; i++) {
    var d3d = {};
    for (var j = 0; j < testData[i].Averages.length; j++) {
     
      var c = parseInt(testData[i].Averages[j]);
      if(isNaN(c)){
         c =0;
      }
      if( j > 0){
        c += d3d[testData[i].Run[j-1]];
      }
      
      obj.timeExtent[0] = Math.min(obj.timeExtent[0],c);
      obj.timeExtent[1] = Math.max(obj.timeExtent[1],c);
      d3d[testData[i].Run[j]] = c;
    }
    obj.d3data.push(d3d);
  }
  
  console.log(obj);
  return obj;
}