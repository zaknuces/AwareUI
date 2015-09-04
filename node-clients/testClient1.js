'use strict';

// client: The entry point of the service
// ------------------------------------

/**
 * @description The entry point of test client  based on NodeJS. This function encapsulate the bootstrap logic. Executing this function
 * will start the client.
 */
var client = function () {
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
	 * @property {object} websocket instance.
	 */
	var client = new webSocket.w3cwebsocket('ws://' + config.web.address + ':' + config.web.port + '/', [config.web.protocol, 'test1']);

	// The test client is based on {@link openweather.org} api. This object contain information about getting that information.
	var options = {
		host: 'api.openweathermap.org',
		post: '80',
		path: '/data/2.5/weather?q=Singapore&units=metric',
		method: 'GET'
	};

	// function that will be called on error
	client.onerror = function () {
		console.log('Connection Error');
	};

	// function that will be called when connection opens.
	client.onopen = function () {
		console.log('WebSocket Client Connected');

		/**
		 * Send update to the service.
		 * Note: For now, we are using {@link openweathermap} data structure and passing it as it is to the service.
		 * This needs to be revised in future.
		 */
		function sendUpdates () {
			if (client.readyState === client.OPEN) {
				http.request(options, function(res) {
					res.setEncoding('utf8');
					res.on('data', function (chunk) {
						var weatherData = JSON.parse(chunk);
						client.send(JSON.stringify({ clientId: 'test1', data: weatherData.main}));
						setTimeout(sendUpdates, 10000);
					});
				}).end();
			}
		}
		sendUpdates();
	};

	// function that will be called on close
	client.onclose = function () {
		console.log('echo-protocol Client Closed');
	};

	// function that will be called when message is received
	client.onmessage = function (e) {
		if (typeof e.data === 'string') {
			console.log("Received: '" + e.data + "'");
		}
	};
}();
