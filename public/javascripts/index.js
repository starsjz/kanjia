
(function(){
	var sio = io.connect( "/" ),
		video = $('video')[0],
		canvas = $('#canvas')[0],
		cxt = canvas.getContext('2d'),
		lastAlarmTime = 0,
		hotSpots = $('#hotSpots'),
		hots = [];

	setInterval( function(){
		cxt.drawImage($('video')[0],0,0,320,240);
		sio.emit('sendImg', canvas.toDataURL('image/jpeg'));
		console.log(canvas.toDataURL('image/jpeg').length/1024);
	}, 1000)

	$(window).on('_motion', function(ev, data){
		//console.log('1111111111111111')
		alarm();
		var spot = $(data.spot.el);
		spot.addClass('active');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
		
	});

	function alarm(data){
		var time = new Date().getTime();
		if( ( time - lastAlarmTime ) > 6000 ){
			cxt.drawImage( video, 0, 0, 160, 120);
			sio.emit( 'sendAlarm', { url: canvas.toDataURL('image/jpeg'), time: time } );
			lastAlarmTime = time;
		}
	}
    
	function createHot(){
		var spot,
			width = ((/\d*/).exec(hotSpots.attr('width'))[0]-0) / 10,
			height = ((/\d*/).exec(hotSpots.attr('height'))[0]-0) / 10,
			i = 0,
			j = 0;
		while( i < 10 ){
			while( j < 10 ){
				spot = $('<div>').css({left: width*j, top: height*i});
				!function(i,j){
					spot.on('motion', function(){
						//console.log('2222222222222222222');
						hotAlarm(i,j);
					});
				}(i,j);
				hotSpots.append( spot );
				++j;
			}
			j = 0;
			++i;
		}
	}
	createHot();
	
	function hotAlarm(i,j){
		hots.push([i,j]);
	}
	
})();