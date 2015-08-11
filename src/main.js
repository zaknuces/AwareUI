/**
 * This is a main entry point of the service.
 */
var WebSocketServer = require('websocket').server;
var http = require('http');
var config = require('../config');
var process = require('./process');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("../");

var staticServer = http.createServer(function(req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});

staticServer.listen(7000);

var server = http.createServer(function(request, response) {
	console.log((new Date()) + ' Received request for ' + request.url);
	response.writeHead(404);
	response.end();
});
server.listen(config.web.port, function() {
	console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
	httpServer: server,
	// You should not use autoAcceptConnections for production
	// applications, as it defeats all standard cross-origin protection
	// facilities built into the protocol and the browser.  You should
	// *always* verify the connection's origin and decide whether or not
	// to accept it.
	autoAcceptConnections: false
});

function originIsAllowed(origin) {
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

wsServer.on('request', function(request) {
	if (!originIsAllowed(request.origin)) {
		// Make sure we only accept requests from an allowed origin
		request.reject();
		console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
		return;
	}

	console.log(request.requestedProtocols);
	var clientID = request.requestedProtocols[1];


	// TODO: update echo-protocol
	var connection = request.accept('eware-protocol', request.origin);
	console.log((new Date()) + ' Connection accepted.');

	// TODO: request should contain a client ID.
	connection.sendUTF(JSON.stringify(process.register(clientID)));

	connection.on('message', function(message) {
		var parsedMsg = JSON.parse(message.utf8Data);

		var notify = process.evaluate(parsedMsg.clientId, parsedMsg.data);

		if (notify) {
			connection.sendUTF(JSON.stringify(notify));
		}
	});
	connection.on('close', function(reasonCode, description) {
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		process.unregister(clientID);
	});
});