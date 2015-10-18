var request = require('request');
var fs = require("fs");
var url = "http://vps.samserrels.com/res/upload.php"

var formData = {
  // Pass data via Streams
  upfile: fs.createReadStream(__dirname + '/Sequential_LinPack200_Sat_Oct_17_15-58-10_2015.csv')
};
request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
	 console.log('resp: ' + httpResponse);
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
});
