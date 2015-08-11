angular.module('ewareApp', [])
	.controller('MainController', function($http, $timeout) {
		var mainCtrl = this;
		mainCtrl.createConnection = function () {
			var connection = new WebSocket('ws://localhost:9980/', ['eware-protocol', 'test1']);

			connection.onopen = function(){
				/*Send a small message to the console once the connection is established */
				function sendNumber() {
					if (connection.readyState === connection.OPEN) {
						$http.get('http://api.openweathermap.org/data/2.5/weather?q=Singapore&units=metric').then(function (response) {
							connection.send(JSON.stringify({ clientId: 'test1', data: response.data.main}));
							$timeout(sendNumber, 10000);
						});
					}
				}
				sendNumber();
			};

			connection.onmessage = function (e) {
				if (!mainCtrl.surroundingInfo || mainCtrl.surroundingInfo.data.temperature != e.data.temperature) {
					mainCtrl.surroundingInfo = e;

					// Update Css.
				}
			};
		};
	}
);