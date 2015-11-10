//var server = "http://vps.samserrels.com/res/";
var server = "http://localhost/";
var index = [];
var fileData = [];
var tableData = [];
var tableCollumns = [];
var indexObjects = [];

function Exists(a) {
	return (a !== undefined && a !== null && a !== "");
}

function Populate() {
	return;
	var populus = [];
	index.forEach(function (element) {
		var o = DataParser.DataNameToObj(element);
		indexObjects.push(o);
		populus.push({ value: o.id, content: o.name });
	}, this);
	t.populate(populus);
}

function AddToChart(name) {
	console.log("Adding", name);
	if (!Exists(name)) {
		//scan manually
	}
	//first find the indexobject
	var io = $.grep(indexObjects, function (a) { return name === a.id; });
	if (io.length != 1) { console.error("Uh OH", name); return; }
	io = io[0];
	//is it loaded?
	if (Exists(io.csv)) {
		//woop
		if (!Exists(io.parsed)) {
			io.parsed = DataParser.ParseCSV(io.csv);
			console.log(io.parsed);
		}
		//compatable?
		if (inChart.length > 0 && !DataParser.MatchingEvents(inChart[0].parsed, io.parsed)) {
			//incompatable
			console.warn("incompatable");
			t.un_select(name);
		} else {
			console.warn("added");
			inChart.push(io);
			UpdateChart();
		}
	} else {
		//loadin
		var csvjqxhr = $.get("uploads/" + io.id, function (data) {
			console.log("Data load success" + io.id);
			io.csv = data;
			AddToChart(name);
		});
		csvjqxhr.fail(function (e) {
			console.log("error", e);
		});
	}

}

var inChart = [];
function UpdateChart() {
	var a = [];
	inChart.forEach(function (e) {
		a.push(e.parsed)
	}, this);
	Chart.ChangeData(DataParser.Combine(a));
}

function RemoveFromChart(name) {
	if (!Exists(name)) {
		//scan manually
	}
	var ind = -1;
	for (var i = 0; i < inChart.length; i++) {
		if (inChart[i].id === name) {
			ind = i;
			break;
		}
	}
	if (ind == -1) { return; }
	inChart.splice(ind, 1);
	UpdateChart();
}

//----


var tdiv;
var table;

function Reorder(a,b) {
	var ai = -1;
	var bi = -1;
	for (var i = 0; i < tableCollumns.length; i++) {
		if(tableCollumns[i].title == a){ai = i;}
		if(tableCollumns[i].title == b){bi = i;}
		if(ai != -1 && bi != -1){
			break;
		}
	}
	if(ai == -1 || bi == -1){
		console.error(ai,bi);
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
	Reorder("filename","name");
	table.html("");
	table.DataTable({
		data: tableData,
		scrollX: true,
		columns: tableCollumns,
		select: true,
		columnDefs: [
			{
                "targets": [ 1 ],
                "width": "10px"
            },
            {
                "targets": [ 4 ],
                "visible": false,
            },
            {
                "targets": [ 5 ],
                "visible": false
            },
			            {
                "targets": [6 ],
                "visible": false
            },
			            {
                "targets": [ 7 ],
                "visible": false
            },
			            {
                "targets": [ 8 ],
                "visible": false
            },     {
                "targets": [ 9 ],
                "visible": false
            },     {
                "targets": [ 10 ],
                "visible": false
            },     {
                "targets": [ 11 ],
                "visible": false
            }
        ]
	});
}


function GetFiles() {
	var jqxhr = $.getJSON(server + "files.php", function (data) {
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