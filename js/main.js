
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
	index = ["GpuParrallelSort256_Mon_Oct_19_16-57-05_2015.csv","GpuParrallelSort256_Mon_Oct_19_16-57-16_2015.csv","Sequential_LinPack10_Sat_Oct_17_18-44-11_2015.csv","Sequential_LinPack10_Sat_Oct_17_18-45-13_2015.csv","Sequential_LinPack200_Sat_Oct_17_15-58-10_2015.csv","sort_2015-10-07_11-01-51.csv","sort_2015-10-07_11-02-00.csv","sort_2015-10-07_11-13-15.csv","sort_2015-10-12_15-18-27.csv"]
	Populate();
});

var indexObjects = [];
function Populate(){
	var populus = [];
	index.forEach(function(element) {
		indexObjects.push(DataParser.DataNameToObj(element));
		populus.push({value:o.id, content:o.name});
	}, this);
	t.populate(populus);
}

function AddToChart(name){
	if(!Exists(name)){
		//scan manually
	}
	//first find the indxobject
	var io = $.grep(indexObjects, function (a) { return a !== a.id; };
	if (io.length != 1){console.error("Uh OH"); return;}
	io = io[0];
	
}

function RemoveFromChart(name){
	if(!Exists(name)){
		//scan manually
	}
}

t.on( "added", function(e,name) {
  console.log("Adding",name);
  AddToChart(name);
});

t.on( "removed", function(e,name) {
  console.log("Removing",name);
  RemoveFromChart(name);
});
