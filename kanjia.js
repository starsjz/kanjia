var weixin = require('weixin-api');
var ServerIP = "115.192.210.229";
var fs = require("fs");


var Answers = {
	demolist:function(msg){
		var resMsg;
		var articles = [];
	    articles[0] = {
	        title : "武林广场",
	        description : "1",
	        picUrl : "http://www.shipin7.com/static/images/b8c0144298a843bfa2e626bfd8eb799c/bea2ee9bac6acd692d1d9962d027620f/1_web.jpeg",
	        url : "http://115.236.50.15:8080/Ehome/415095074&1&1&0&115.236.50.10&7990.m3u8"
	    };
	    articles[1] = {
	        title : "我家鱼缸",
	        description : "2",
	        picUrl : "http://www.shipin7.com/static/images/b8c0144298a843bfa2e626bfd8eb799c/9816556e25703fac10e287d788e6c092/1_web.jpeg",
	        url : "http://115.236.50.15:8080/Ehome/418359619&1&1&0&115.236.50.10&7990.m3u8"
	    };
	    articles[2] = {
	        title : "可迪超市",
	        description : "3",
	        picUrl : "http://www.shipin7.com/static/images/b8c0144298a843bfa2e626bfd8eb799c/bc1eed135f9d0e7cb91d437d7336fe9f/1_web.jpeg",
	        url : "http://115.236.50.15:8080/Ehome/416121732&1&1&0&115.236.50.10&7990.m3u8"
	    };
	    articles[3] = {
	        title : "广州海康",
	        description : "",
	        picUrl : "http://www.shipin7.com/static/images/b8c0144298a843bfa2e626bfd8eb799c/8ee83abdc80c58e295044970895b8595/1_web.jpeg",
	        url : "http://115.236.50.15:8080/Ehome/416693234&1&1&0&115.236.50.10&8990.m3u8"
	    };
	    resMsg = {
	        fromUserName : msg.toUserName,
	        toUserName : msg.fromUserName,
	        msgType : "news",
	        articles : articles,
	        funcFlag : 0
	    }
	    console.log(" weixin.sendMsg(resMsg)");
	    console.log();
	    weixin.sendMsg(resMsg);
	    return resMsg;
	}
	,
	mycameras:function(msg){
		/*
		require("fs").readdir("pic",function(err,files){
			console.log(files.length);
		});
		*/
        fs.writeFile("./usersdata/"+msg.fromUserName +'/cover.jpeg', global.currentImg, 'base64', function(err) {
          console.log("cover");
        });       


		var resMsg;
		var articles = [];
		console.log("http://"+ServerIP+"/cover.jpeg");
	    articles[0] = {
	        title : "我家",
	        description : new Date().toUTCString(),
	        picUrl : "http://"+ServerIP+"/usersdata/"+msg.fromUserName+"/cover.jpeg?"+Math.random(),
	        url : "http://" + ServerIP + "/view/"+msg.fromUserName
	    };
	    resMsg = {
	        fromUserName : msg.toUserName,
	        toUserName : msg.fromUserName,
	        msgType : "news",
	        articles : articles,
	        funcFlag : 0
	    }
	    weixin.sendMsg(resMsg);
	    return resMsg;

	}
}

function getAnswer(msg){
	var replays = {
		"9":Answers.demolist,
		"演示点":Answers.demolist,
		"demolist":Answers.demolist,
		"k":Answers.mycameras,
		"8":Answers.mycameras,
		"我家":Answers.mycameras,
		"看视频":Answers.mycameras,
		"看":Answers.mycameras,
		"列表":Answers.mycameras,

	}


	console.log("------------"+msg);
	console.log(replays[msg.content]);
	return (replays[msg.content]||function(){})(msg);
}

exports.getAnswer = getAnswer;
