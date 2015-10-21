
var t = $("#transferDiv").bootstrapTransfer(
				{'target_id': 'multi-select-input',
				 'height': '15em',
				 'hilite_selection': true
				 }
		);
	
var index = [];	
var jqxhr = $.getJSON( "http://vps.samserrels.com/res/dir.php", function( data ) {				 
	console.log(data);
	index = data;
	Populate()
});		 
jqxhr.fail(function() {
    console.log( "error" );
	index = ["GpuParrallelSort65536_Wed_Oct_21_15-20-49_2015.csv","GpuParrallelSort256_Mon_Oct_19_16-57-05_2015.csv","GpuParrallelSort65536_Wed_Oct_21_15-17-56_2015.csv","GpuParrallelSort256_Wed_Oct_21_15-12-46_2015.csv","GpuParrallelSort256_Mon_Oct_19_16-57-16_2015.csv","Sequential_LinPack10_Sat_Oct_17_18-44-11_2015.csv","Sequential_LinPack10_Sat_Oct_17_18-45-13_2015.csv","Sequential_LinPack200_Sat_Oct_17_15-58-10_2015.csv","sort_2015-10-07_11-01-51.csv","sort_2015-10-07_11-02-00.csv","sort_2015-10-07_11-13-15.csv","sort_2015-10-12_15-18-27.csv"]
	Populate();
});

var indexObjects = [];

function Populate(){
	var populus = [];
	index.forEach(function(element) {
		var o = DataParser.DataNameToObj(element);
		indexObjects.push(o);
		populus.push({value:o.id, content:o.name});
	}, this);
	t.populate(populus);
}

function AddToChart(name){
	console.log("Adding",name);
	if(!Exists(name)){
		//scan manually
	}
	//first find the indexobject
	var io = $.grep(indexObjects, function (a) { return name === a.id; });
	if (io.length != 1){console.error("Uh OH",name); return;}
	io = io[0];
	//is it loaded?
	if(Exists(io.csv)){
		//woop
		if(!Exists(io.parsed)){
			io.parsed = DataParser.ParseCSV(io.csv);
			console.log(io.parsed);
		}
		//compatable?
		if(inChart.length > 0 && !DataParser.MatchingEvents(inChart[0].parsed,io.parsed)){
			//incompatable
			console.warn("incompatable");
			t.un_select(name);
		}else{
			console.warn("added");
			inChart.push(io);
			UpdateChart();
		}
	}else{
		//loadin
		var csvjqxhr = $.get( "uploads/"+io.id, function( data ) {				 
			console.log("Data load success" + io.id);
			io.csv = data;
			AddToChart(name);
		});	
		csvjqxhr.fail(function(e) {
    		console.log( "error",e );	
		});
	}
	
}

var inChart = [];
function UpdateChart(){
	var a = [];
	inChart.forEach(function(e) {
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

t.on( "added", function(e,name) {
  AddToChart(name);
});

t.on( "removed", function(e,name) {
  console.log("Removing",name);
  RemoveFromChart(name);
});
