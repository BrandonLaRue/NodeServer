/**
	Things to fix:
		1. Re-impliment the default paths with the 'path' module from node
			ie. set up relative path names
		2. Make it so only certain directories can be accessed
			(permissions and accounts?) (link with db?)
*/

var http = require("http");
var url = require("url");
var fs = require("fs");
var path  = require("path");

var port = 1337;
var defaultPath = "C:/Users/Galbatronx/Desktop/NodeServer";	// should be the absolute location of the base directory of your site 
var defaultPage = "index.html";	// shouldn't begin with a '/'

/*
	A simple server that runs on the given port and responds with content
*/
var server = http.createServer(function(request, response) {
	console.log("We have recieved a connection");

	// the file to be routed to
	var pathname = url.parse(request.url, true).pathname;
	console.log("Pathname:" + pathname);

	// set fileExtension of requested file
	var fileExtension = path.extname(pathname);
	console.log("File extension: " + fileExtension);

	/*
		set up pathname variable which determines which file to serve
	*/
	// if the pathname doesn't have a file extension
	if(fileExtension === "") {

		// if path points to a directory
		if(pathname.charAt(pathname.length-1) === '/') {
			pathname += defaultPage;	// set to directory/index.html
		}	
		else {
			pathname += "/" + defaultPage;
		}
	}
	console.log("Pathname: " + pathname);
	

	/*
		Dynamically set content type and encoding based on the filetype requested
	*/
	var contentType;
	var encoding;
	fileExtension = path.extname(pathname);

	if(fileExtension === ".js") {
		contentType = "application/javascript";
		encoding = "utf8";
	}
	else if(fileExtension === ".css") {
		contentType = "text/css";
		encoding = "utf8";
	}
	else if(fileExtension === ".png") {
		contentType = "image/png";
		encoding = "binary";
	}
	else if(fileExtension === ".ico") {
		contentType = "image/x-icon";
		encoding = "binary";
	}
	else {
		contentType = "text/html"
		encoding = "utf8";
	}

	
	/*
		Allows the server to be shutdown by passing shutdown to the
		'data' property of the url query
	*/
	if(url.parse(request.url, true).query.data) {
		var data = url.parse(request.url, true).query.data;

		if(data.toString().toLowerCase() === "shutdown") {
			console.log("\nThe server will no longer accept new connections\n");
			server.close(function() {
				console.log("\nServer shutdown remotely. Goodbye!");
			});
		}
	}
	
	/*
		Write content to page
	*/
	var dataPath = defaultPath + pathname;
	var htmlResponseCode;

	// attempt to read and serve file
	console.log("Attempting to serve: " + dataPath + "\n");
	fs.readFile(dataPath, function(err, fileData) {	
		if(err) {
			htmlResponseCode = 404;
			var data = "Sorry, unable to locate your file";
		}
		else {
			htmlResponseCode = 200;
			data = fileData;
		}
		response.writeHead(htmlResponseCode, { "Content-Type": contentType });
		response.write(data, encoding);
		response.end();
	});
});

// start server
server.listen(port);
console.log("Server started on " + port + "\n");