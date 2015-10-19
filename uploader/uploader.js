var request = require('request');
var fs = require("fs");
var url = "http://vps.samserrels.com/res/upload.php"

var file = process.argv[2];

if(file !== undefined && file != ""){
	console.log("Attempting to upload: ",file);
	var fileStream = fs.createReadStream(file);
	var formData = {
		  upfile: fileStream
	};
	
	fileStream.on('open', function () {
    	request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
		console.log('resp: ' + httpResponse);
		if (err) {
			return console.error('upload failed:', err);
		}
		console.log('Upload successful!  Server responded with:', body);
	});
	
	fileStream.on('error', function(err) {
	console.log("File open fail ",err);
	});
	
  });
	
}else{
	console.log("Please specify a file");
}

