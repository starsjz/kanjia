/*
 * BAE Node.js application demo
 */

/* Port which provided by BAE platform */

var http = require('http'),
    sys = require('util'),
	fs = require("fs"),
	express = require('express'),
    weixin = require('weixin-api'),	
    util = require('./util.js')
  , routes = require('./routes')
  , user = require('./routes/user')
  , socket = require('socket.io')
  , http = require('http')
  , path = require('path')
  , kanjia = require('./kanjia');

var app = express(),
    server = http.createServer(app),
    io = socket.listen(server);
io.set('log level', 0);



console.log("=======  iKanjia 818  Running  ======");

// 解析器
app.use(express.bodyParser());
app.use(express.compress());
//app.use(xmlBodyParser);

// 接入验证
app.use(express.static(__dirname));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'pic')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/view/:weixinUserName', user.view);
app.get('/replay/:camera', user.replay);

app.get('/', function(req, res) {
    // 签名成功
    if (weixin.checkSignature(req)) {
        res.send(200, req.query.echostr);
    } else {
        res.send(200, 'start!');
    }
});

app.get('/live/:camera',routes.index);




var devices = {};

var index = 0;
io.sockets.on( 'connection', function( socket ){
    socket.on('sendImg', function(data){
        //console.log(data.length);
        socket.broadcast.emit('getImg', data);
        var base64Data = data.replace(/^data:image\/jpeg;base64,/,"");
        global.currentImg = base64Data;

        /* 保存截图
        fs.writeFile('./usersdata/oPnOqjndQ_OE8dXwZKO9ERk5TLbQ/pic/pic'+(index++)+'.jpeg', base64Data, 'base64', function(err) {
          console.log(new Date().getSeconds());
        });
        */
        
        
    });

    socket.on('sendAlarm', function(data){
        socket.broadcast.emit('getAlarm', data);
    });
});



// config
weixin.token = 'shipin7';

// 监听文本消息
weixin.textMsg(function(msg) {
    console.log("textMsg received");
    console.log(JSON.stringify(msg));
    kanjia.getAnswer(msg);
    
});

// 监听图片消息
weixin.imageMsg(function(msg) {
    console.log(JSON.stringify(msg));
    util.getCodeFromePic(msg.picUrl,function(deviceCode){


        var articles = [];
        articles[0] = {
            title : "设备添加成功",
            description : "设备序列号:" + deviceCode,
            picUrl : "http://www.shipin7.com/static/images/b8c0144298a843bfa2e626bfd8eb799c/bea2ee9bac6acd692d1d9962d027620f/1_web.jpeg",
            url : "http://115.236.50.15:8080/Ehome/415095074&1&1&0&115.236.50.10&7990.m3u8"
        };
        resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "news",
            articles : articles,
            funcFlag : 0
        }

        weixin.sendMsg(resMsg);


    });



});
weixin.eventMsg(function(msg){
    console.log(msg);

    fs.mkdir("./usersdata/"+msg.fromUserName);
    fs.mkdir("./usersdata/"+msg.fromUserName+"/pic");

    var articles = [];
    articles[0] = {
        title : "汪！汪！汪！",
        description : "主任，我等了你500年！你终于来了",
        picUrl : "http://t0.gstatic.com/images?q=tbn:ANd9GcQMDChOdBwBGo-qvF6S4o-b1nb4eTSrcwJphupfwrF4A2CRVj1K",
        url : "https://status.github.com/"
    };

    
    if(msg.event == "subscribe"){
         resMsg = {
            fromUserName : msg.toUserName,
            toUserName : msg.fromUserName,
            msgType : "news",
            articles : articles,
            funcFlag : 0
        }

        weixin.sendMsg(resMsg);       
    }
});

app.post('/', function(req, res) {

    // loop
    weixin.loop(req, res);
    console.log(req);

});

server.listen(80);

