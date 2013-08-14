
var num = 0;
var sio = window.sio = io.connect( "/" );
var board = $('#board'),
	alarm = $('#alarm'),
	_flag = 1;

sio.on('getImg', function( img ){
	board.attr( 'src', img );
	$("#count").html("imgs:"+(num++) + "&nbsp;&nbsp;&nbsp;speed:"+ Math.floor(img.length/200) + "kb" );
});
sio.on('getAlarm', function( data ){
	var date = new Date( data.time ),
		time = (date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	var div = $('<div>').html('<h2>' + _flag++ + '、' + time + '</h2><img width="100" height="80" src="' + data.url + '" />')
	alarm.prepend(div)
});

sio.emit('fetchCover');
    
