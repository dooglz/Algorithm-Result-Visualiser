var server = "http://vps.samserrels.com/res/";
//var server = "http://localhost:8080/";
//var source = "testData.json";
var source = "files.php";

var index = [];
var fileData = [];
var tableData = [];
var tableCollumns = [];

function AddToChart(name) {
  console.log("Adding", name);
  var dataToAdd = fileData[name];
		//compatable?
		if (inChart.length > 0 && !DataParser.MatchingEvents(inChart[0], dataToAdd)) {
      //incompatable
      console.warn("incompatable");
      //t.un_select(name);
		} else {
      console.warn("added");
      inChart.push(dataToAdd);
      UpdateChart();
		}
}

var inChart = [];
function UpdateChart() {
  var a = [];
  inChart.forEach(function (e) {
    a.push(e)
  }, this);
  Chart.ChangeData(DataParser.Combine(a));
}

function RemoveFromChart(name) {
 var datatoRem = fileData[name];
  var ind = -1;
  for (var i = 0; i < inChart.length; i++) {
    if (inChart[i].name === datatoRem.name) {
      ind = i;
      break;
    }
  }
  if (ind == -1) { return; }
  inChart.splice(ind, 1);
  UpdateChart();
}

var tdiv;
var table;

function Reorder(a, b) {
  var ai = -1;
  var bi = -1;
  for (var i = 0; i < tableCollumns.length; i++) {
    if (tableCollumns[i].title == a) { ai = i; }
    if (tableCollumns[i].title == b) { bi = i; }
    if (ai != -1 && bi != -1) {
      break;
    }
  }
  if (ai == -1 || bi == -1) {
    console.error(ai, bi);
    return false;
  }
  var t = tableCollumns[ai];
  tableCollumns[ai] = tableCollumns[bi];
  tableCollumns[bi] = t;
  for (var i = 0; i < tableData.length; i++) {
    var t = tableData[i][ai];
    tableData[i][ai] = tableData[i][bi];
    tableData[i][bi] = t;
  }
}


function InitTable() {
  if (!Exists(fileData)) { return; }
  tableData = [];
  tableCollumns = [];	
	
  //get collums
  var keys = Object.keys(fileData[0]);
  keys.forEach(function (k) {
    if (!$.isArray(fileData[0][k])) {
      tableCollumns.push({ title: k });
      for (var j = 0; j < fileData.length; j++) {
        if (tableData.length == j) { tableData.push([]); }
        if (!Exists(fileData[j][k])) {
          fileData[j][k] = "-";
        }
        tableData[j].push(fileData[j][k])
      }

    }
  }, this);
  Reorder("filename", "name");

  for (var i = 0; i < tableData.length; i++) {
    tableData[i].unshift("");
  }
  tableCollumns.unshift({ title: "Select" });

  table.html("");
  var dTable = table.DataTable({
    data: tableData,
    scrollX: true,
    columns: tableCollumns,
    select: {
      style: 'multi',
      selector: 'td:first-child'
    },
    order: [[1, 'asc']],
    columnDefs: [
      {
        orderable: false,
        className: 'select-checkbox',
        targets: 0
      },
      {
        "targets": [1],
        "width": "10px"
      },
      {
        "targets": [4, 5, 6, 7, 8, 9, 10, 11, 12],
        "visible": false,
      },
    ]
  });
  dTable
    .on('select', function (e, dt, type, indexes) {
      console.log(indexes[0]);
      AddToChart(indexes[0]);
    })
    .on('deselect', function (e, dt, type, indexes) {
      console.log(indexes[0]);
      RemoveFromChart(indexes[0]);
    });

}


function GetFiles() {
  var jqxhr = $.getJSON(server + source, function (data) {
    fileData = data;
    InitTable();
  });
  jqxhr.fail(function (e) {
    console.log("error", e);
  });
}

$(document).ready(function () {
  tdiv = $("#tableDiv");
  table = $('#table_id');
})
;