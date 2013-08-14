var http = require('http');
var req = http.get("http://172.7.1.56:4000/test", function(res) {
	    res.on('data', function (chunk) {
	        console.log(chunk);
	    });
	    res.on('end', function(){
	    	console.log("end");
	    });
	});