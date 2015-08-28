'use strict';

/**
 * @namespace app
 * @description The entry point of aware service. This function encapsulate the bootstrap logic. Executing this function
 * will start the service to interact with clients.
 */
var app = function () {
	/**
	 * @property {object} webSocket the web socket module.
	 */
	var webSocket = require('websocket');

	/**
	 * @property {object} http the http module.
	 */
	var http = require('http');

	/**
	 * @property {object} config the config module.
	 */
	var config = require('../config');

	/**
	 * @property {object} process the process module.
	 */
	var process = require('./process');

	/**
	 * @property {object} finalhandler the final handler module
	 */
	var finalHandler = require('finalhandler');

	/**
	 * @property {object} serveStatic the serve static module
	 */
	var serveStatic = require('serve-static');

	/**
	 * @function app.runStaticServer
	 * @description Run the static server that will be used to establish a way for clients to download style documents.
	 */
	function runStaticServer () {
		var staticServer = http.createServer(function(req, res) {
			serveStatic("../")(req, res, finalHandler(req, res));
		});
		staticServer.listen(config.staticContent.port);
	};

	/**
	 * @function app.createServer
	 * @description create the server that will be used by web sockets.
	 * @return {object] instance of the created server
	 */
	function createServer () {
		var server = http.createServer(function(request, response) {
			console.log((new Date()) + ' Received request for ' + request.url);
			response.writeHead(404);
			response.end();
		});
		server.listen(config.web.port, function() {
			console.log((new Date()) + ' Server is listening on port ' + config.web.port);
		});

		return server
	};

	/**
	 * @function app.runWebSocket
	 * @description run the web socket
	 * @param {object} the http server instance.
	 */
	function runWebSocket (server) {
		var wsServer = new webSocket.server({
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
		};

		function onSocketMessage (message) {
			var parsedMsg = JSON.parse(message.utf8Data);

			var notify = process.evaluate(parsedMsg.clientId, parsedMsg.data);

			if (notify) {
				connection.sendUTF(JSON.stringify(notify));
			}
		};

		function onSocketClose () {
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
			process.unregister(clientID);
		}

		wsServer.on('request', function(request) {
			if (!originIsAllowed(request.origin)) {
				// Make sure we only accept requests from an allowed origin
				request.reject();
				console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
				return;
			}

			var clientID = request.requestedProtocols[1];

			// TODO: update echo-protocol
			var connection = request.accept('eware-protocol', request.origin);
			console.log((new Date()) + ' Connection accepted.');

			// TODO: request should contain a client ID.
			connection.sendUTF(JSON.stringify(process.register(clientID)));

			connection.on('message', onSocketMessage);
			connection.on('close', onSocketClose);
		});
	};

	runStaticServer();
	runWebSocket(createServer());
}();


