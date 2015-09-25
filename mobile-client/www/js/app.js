// App: test mobile client angular module

// The main application module of the test mobile application.
angular.module('ewareApp', [])
	// Add listener to 'deviceready' event.
	.run(['$rootScope', function ($rootScope) {
		document.addEventListener('deviceready', function () {
			$rootScope.$broadcast('device-ready');
		}, false);
	}])

	// Main controller of the application that will interact with aware service and update the styling of the application.
	.controller('MainController', function($http, $timeout, $scope) {
		var mainCtrl = this;

		$scope.$on('device-ready', function () {
			var parentElement = document.getElementById('deviceready');
			var listeningElement = parentElement.querySelector('.listening');
			var receivedElement = parentElement.querySelector('.received');

			var serviceLocatorEl = document.getElementById('service-location');
			serviceLocatorEl.setAttribute('style', 'display:block;');

			listeningElement.setAttribute('style', 'display:none;');
			receivedElement.setAttribute('style', 'display:block;');
		});

		/**
		 * Set address of the service and calls (@link #createConnection} method.
		 */
		mainCtrl.setAddress = function () {
			var addressEl = document.getElementById('address');

			if (addressEl.value) {
				this.createConnection(addressEl.value);
			}
		};

		/**
		 * create socket connection with the aware service.
		 */
		mainCtrl.createConnection = function (address) {
			var connection = new WebSocket('ws://' + address + ':' + config.web.port + '/', [config.web.protocol, 'test1']);

			// function that will be called when connection opens.
			connection.onopen = function () {
				/**
				 * Send update to the service.
				 * Note: For now, we are using {@link openweathermap} data structure and passing it as it is to the service.
				 * This needs to be revised in future.
				 */
				function sendUpdates () {
					if (connection.readyState === connection.OPEN) {
						$http.get('http://api.openweathermap.org/data/2.5/weather?q=Singapore&units=metric').then(function (response) {
							connection.send(JSON.stringify({ clientId: 'test1', data: response.data.main}));
							$timeout(sendUpdates, 10000);
						});
					}
				}
				sendUpdates();
			};

			// function that will be called with there is a message from service.
			connection.onmessage = function (e) {
				if (!mainCtrl.surroundingInfo || mainCtrl.surroundingInfo.data.temperature != e.data.temperature) {
					mainCtrl.surroundingInfo = e;

					var temperatureMetaData = JSON.parse(e.data);

					if (temperatureMetaData.css) {
						var head = document.getElementsByTagName('head')[0],
							link = document.createElement('link');
						link.setAttribute('href', temperatureMetaData.css);
						link.setAttribute('rel', 'stylesheet');
						link.setAttribute('type', 'text/css');
						head.appendChild(link);
					}
				}
			};
		};
	}
);