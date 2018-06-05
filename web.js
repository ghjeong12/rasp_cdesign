var http = require('http');

var photo_path = __dirname+"/photo/"+Date.now()+'.jpg';
var exec_photo = require('child_process').exec;
var cmd_photo = 'raspistill -t 1000 -o ' + photo_path;

function onRequest(request, response)
{
	console.log("user request" + request.url);
	response.writeHead(200, {"Context-Type":"text/pplain"});
	response.write("hello world");
	response.end();
}

http.createServer(onRequest).listen(9080);
console.log("Node web server start on 9080");
