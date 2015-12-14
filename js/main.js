var server = "http://vps.samserrels.com/res/";
//var server = "http://localhost:8080/";
//var source = "testData.json";
var source = "files.php";

var index = [];
var fileData = [];
var tableData = [];
var tableCollumns = [];
var dTable;
var tdiv;
var table;

var selectedTable;
var selectedTableDiv;
var selectedDataTable;

var selectedTableData = [];
var selectedTableDataSource = [];
var selectedTableCollumns = [];

//called when data is seelcted on datatable
function AddToChart(index) {
  var dataToAdd = fileData[index];
  console.log("Adding", index, dataToAdd.name);
  if (!Exists(fileData.tableIndex)) {
    dataToAdd.tableIndex = index;
  }
  if (inChart.length > 0 && $.grep(inChart, function (a) { return a.tableIndex == index; }).length != 0) {
    console.warn("Already in chart");
  } else if (inChart.length > 0 && !DataParser.MatchingEvents(inChart[0], dataToAdd)) {
    console.warn("Incompatable");
  } else {
    inChart.push(dataToAdd);
    UpdateChart();
  }
}

var inChart = [];
function UpdateChart() {
  dTable.draw();
  var a = [];
  selectedTableData = [];
  selectedDataTable.clear();

  inChart.forEach(function (e) {
    a.push(e);
    selectedTableData.push(selectedTableDataSource[e.tableIndex]);
  }, this);

  if (selectedTableData.length > 0) {
    selectedTable.dataTable().fnAddData(selectedTableData);
    //lets update some colours
    
  }
  selectedDataTable.draw();
  Chart.ChangeData(DataParser.Combine(a));
}

function RemoveFromChart(index) {
  var ind = -1;
  for (var i = 0; i < inChart.length; i++) {
    if (inChart[i].tableIndex === index) {
      ind = i;
      break;
    }
  }
  if (ind == -1) { return; }
  inChart.splice(ind, 1);
  UpdateChart();
}

//takes two collumn names and swaps them in tableCollumns and tableData
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

//Smooths incomming data, creates dataselect table
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

  //do some horrible hack to copy
  selectedTableDataSource = JSON.parse(JSON.stringify(tableData));
  selectedTableCollumns = JSON.parse(JSON.stringify(tableCollumns));
  
  //create the selected table
  selectedDataTable = selectedTable.DataTable({
    data: selectedTableData,
    scrollX: true,
    paging: false,
    searching: false,
    columns: selectedTableCollumns,
    fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      console.log(aData);
      $('td', nRow).css("background", 'linear-gradient(rgba(0,0,0,0),' + d3ColourToCss(d3.rgb(c10(Find(selectedTableData, aData[1], 1))), 0.5) + ')');
    }
  });

  //add in the select collumn
  for (var i = 0; i < tableData.length; i++) {
    tableData[i].unshift("");
  }
  tableCollumns.unshift({ title: "Select" });

  table.html("");
  dTable = table.DataTable({
    fnRowCallback: function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      if (inChart.length > 0) {
        if (DataParser.MatchingEvents(inChart[0], fileData[iDisplayIndexFull])) {
          $('td', nRow).removeClass('redbg');
          $('td', nRow).prop('disabled', false);
        } else {
          $('td', nRow).addClass('redbg');
          $('td', nRow).prop('disabled', true);
        }
      } else {
        $('td', nRow).removeClass('redbg');
        $('td', nRow).prop('disabled', false);
      }
    },
    data: tableData,
    //scrollX: true,
    // scrollY: "500px",
    // scrollCollapse: true,
    columns: tableCollumns,
    select: {
      style: 'multi',
      selector: 'td:first-child'
    },
    order: [[3, 'desc']],
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
        "targets": [4, 5, 6, 7, 8, 9, 10, 11],
        "visible": false,
      },
    ]
  });
  dTable
    .on('select', function (e, dt, type, indexes) {
      AddToChart(indexes[0]);
    })
    .on('deselect', function (e, dt, type, indexes) {
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
  selectedTable = $('#selectedDataTable_id');
  selectedTableDiv = $('#selectedDataTableDiv');
  GetFiles();
})
;

function Find(arr, name, attr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][attr] == name) {
      return i;
    }
  }
  return -1;
}