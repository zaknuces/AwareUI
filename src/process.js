/**
 * Created by zahido on 8/9/2015.
 */
var config = require('../config');

var process = (function () {

	var clientMap = {};

	var DEFAULT_CONFIG = {
		css: config.css.default,
		data: {
			temperature: 'med'
		}
	};

	return {
		register: function (clientId) {
			return clientMap[clientId] = DEFAULT_CONFIG;
		},

		evaluate: function (clientId, surroundingData) {
			if (clientMap[clientId]) {
				if (surroundingData.temp < 0 && clientMap[clientId].data.temperature !== 'frozen') {
					return clientMap[clientId] = {
						css: config.css.frozen,
						data: {
							temperature: 'frozen'
						}
					}
				} else if (surroundingData.temp >= 0 && surroundingData.temp <= 10 && clientMap[clientId].data.temperature !== 'low') {
					return clientMap[clientId] = {
						css: config.css.low,
						data: {
							temperature: 'low'
						}
					}
				} else if (surroundingData.temp > 10 && surroundingData.temp <= 25 && clientMap[clientId].data.temperature !== 'med') {
					return clientMap[clientId] = {
						css: config.css.default,
						data: {
							temperature: 'med'
						}
					}
				} else if (surroundingData.temp > 25 && surroundingData.temp <= 40 && clientMap[clientId].data.temperature !== 'high') {
					return clientMap[clientId] = {
						css: config.css.high,
						data: {
							temperature: 'high'
						}
					}
				} else if (surroundingData.temp > 40 && clientMap[clientId].data.temperature !== 'inferno') {
					return clientMap[clientId] = {
						css: config.css.inferno,
						data: {
							temperature: 'inferno'
						}
					}
				}

			}
		},

		unregister: function (clientId) {
			clientMap[clientId] = null;
		}
	}
}());

module.exports = process;


