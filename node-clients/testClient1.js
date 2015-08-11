var W3CWebSocket = require('websocket').w3cwebsocket;
var config = require('../../config');
var http = require('http');

var client = new W3CWebSocket('ws://localhost:' + config.web.port + '/', ['eware-protocol', 'test1']);

var options = {
	host: 'api.openweathermap.org',
	post: '80',
	path: '/data/2.5/weather?q=Singapore&units=metric',
	method: 'GET'
};

client.onerror = function() {
	console.log('Connection Error');
};

client.onopen = function() {
	console.log('WebSocket Client Connected');

	function sendNumber() {
		if (client.readyState === client.OPEN) {
			http.request(options, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (chunk) {
					var weatherData = JSON.parse(chunk);
					client.send(JSON.stringify({ clientId: 'test1', data: weatherData.main}));
					setTimeout(sendNumber, 10000);
				});
			}).end();
		}
	}
	sendNumber();
};

client.onclose = function() {
	console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
	if (typeof e.data === 'string') {
		console.log("Received: '" + e.data + "'");
	}
};