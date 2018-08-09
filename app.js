var express = require('express'),
	    http = require('http'),
	    app = express(),
	    server = http.createServer(app) ;
app.use(express.static(__dirname + '/images')) ;
var img_flag = 0 ;

var cameraOptions = {
	  width : 1280,
	  height : 720,
	  mode : 'photo',
	  awb : 'fluorescent',
	  encoding : 'jpg',
	  output : 'images/camera.jpg',
	  q : 100,
	  timeout : 3600*1000,
	  timelapse : 0,
	  nopreview : true,
	  th : '0:0:0',
	  br : 70,
	  vf : true,
	  hf : true
};
/*
var camera = new require('raspicam')(cameraOptions) ;
camera.start() ;

camera.on('exit', function() {
	camera.stop() ;
	console.log("camera exited");
	//console.log('Restart camera') ;
	//camera.start() ;
}) ;
*/
var NodeWebcam = require("node-webcam");
var opts = {
	width: 1280,
	height: 720,
	quality: 100,
	delay: 0,
	saveShots: true,
	output: "jpeg",
	device: false,
	callbackReturn: "location"
};
var Webcam = NodeWebcam.create(opts);
/*
camera.on('read', function() {
	console.log("file created");
	img_flag = 1 ;
});
*/
app.get('/cam', function(req, res) {
	res.sendfile('cam.html', {root : __dirname}) ;
}) ;

app.get('/img', function (req, res) {
	console.log('get /img') ;
	NodeWebcam.capture("captured", opts, function(err, data){
		if(!err)
		{
			console.log("Image created!");
			var Jimp = require("jimp");
			Jimp.read("captured.jpg", function(err, result)
			{
				result.rotate(180).write("camera.jpg");
				img_flag =1 ;
			});
		}
		else
			console.log(err);
	});
	if (img_flag == 1) {
		console.log("send img");
		img_flag = 0 ;
		//res.writeHead(200, {'Content-Type' : 'text/html'});
		res.sendfile('images/camera.jpg') ;
		
		var FTPS=require('ftps');
		var ftps = new FTPS({
			host:'excite.postech.ac.kr',
			username:'test_user',		// THIS SHUOLD BE CHANGED
			password:'test_password',	// THIS SHOULD BE CHANGED
			protocol: 'sftp',
			port:22
		});
		ftps.cd('./cdesign/samples/pblock/uploads/').addFile(__dirname+'/images/camera.jpg').exec(console.log);
		img_flag = 0;
	}
}) ;

var GPIO = require('onoff').Gpio;
var button = new GPIO(17, 'in', 'both');
var last_state=0;
/* This function deals with button click */
function click(err, state){
	if((state == 1))
	{
		console.log("Button clicked");
		//console.log('get /img') ;
		
		var io =require('socket.io-client')
		var socket_button = io.connect('http://excite.postech.ac.kr:3000');
		socket_button.on('connect', function()
		{
			socket_button.emit('buttonClicked', {hello: 'world!'});
		});

		NodeWebcam.capture("captured", opts, function(err, data){
		if(!err)
		{
			console.log("Image created!");
			var Jimp = require("jimp");
			Jimp.read("captured.jpg", function(err, result)
			{
				console.log("camera.jpg written");
				result.rotate(180).greyscale().write("camera.jpg", function(err, data)
				{
					console.log("Done camera.jpg");
					var FTPS=require('ftps');
					var ftps = new FTPS({
			host:'excite.postech.ac.kr',
			username:'test_user',		// THIS SHUOLD BE CHANGED
			password:'test_password',	// THIS SHOULD BE CHANGED
			protocol: 'sftp',
						port:22
					});
					ftps.cd('./cdesign/samples/pblock/uploads/').addFile(__dirname+'/camera.jpg').exec(console.log, function(err, data){
					console.log("Done transfer");
		//var io = require('socket.io')(server);
		var socket = io.connect('http://excite.postech.ac.kr:3000');
		socket.on('connect', function()
		{
			socket.emit('imageTransfer', {hello: 'world!'});
		});
		socket.on('news', function (data) {
				console.log(data);
				socket.emit('my other event', { my: 'data' });
			});

					last_state = 1;
					});
	
				});
				img_flag =1 ;
			});
		}
		else
			console.log(err);
		});
/*
		if (img_flag == 1) {
		console.log("send img");
		img_flag = 0 ;
		//res.writeHead(200, {'Content-Type' : 'text/html'});
		//res.sendfile('images/camera.jpg') ;
		
			img_flag = 0;
		var io =require('socket.io-client')
		//var io = require('socket.io')(server);
		var socket = io.connect('excite.postech.ac.kr:3000');
		socket.on('connect', function()
		{
			socket.emit('imageTransfer', {hello: 'world!'});
		});
		socket.on('news', function (data) {
				console.log(data);
				socket.emit('my other event', { my: 'data' });
			});
		}		
		console.log("Done handling");*/
	}
	else if((state == 0) && (last_state == 1)){
		console.log("Button unclicked");
		//last_state=0;
	}
}
button.watch(click);

server.listen(3000, function() {
	    console.log('express server listening on port ' + server.address().port) ;
}) ;
