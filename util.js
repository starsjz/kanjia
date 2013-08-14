var http = require('http'),
	qrcode = require('./easyimage/qrcode').qrcode,
    Canvas = require('canvas'),
	fs = require("fs"),
	easyimg = require('./easyimage/easyimage.js');

exports.getCodeFromePic = function(url,callback){

	http.get(url,function(res){
		var type = res.headers["content-type"],
			body = "";

	    res.setEncoding('binary');
		res.on('data', function (chunk) {
			//console.log(chunk);
	        if (res.statusCode == 200) body += chunk;
	    }); 
	    res.on('end', function () {

	    	var  path = __dirname+"/" ;

	    	var data = new Buffer(body, 'binary');
	    	console.log(data);

			fs.writeFile("out.jpg", data, function(err) {
				if(err){
				   console.log(err);
				}else{
				    var imgsrc = "out.jpg";
				    var convert_imgsrc = "out.png";

				    easyimg.convert({src:path+imgsrc, dst:path+convert_imgsrc, quality:100}, function(err, image) {
		                if (err) throw err;
		                imgDecode(path+convert_imgsrc,callback);
		            });

				}
			});	

		});
	});

};




function imgDecode(src,callback){
    var img = new Canvas.Image; // Create a new Image
    //img.src = 'http://127.0.0.1:3000/images/a.png';
    img.src  = src;
    var canvas = new Canvas(img.width, img.height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);   
    qrcode.decode(canvas,function(text){
    	callback(text);
        console.log('decode success!!!   ' +text);
    });
}  
