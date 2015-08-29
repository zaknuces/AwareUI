'use strict';

var config = require('../config');

// Process Module
// -----------------------------

/**
 * @description The module responsible for processing client data and suggest styling and theme options.
 */
var process = (function () {

	/**
	 * @property {Object} clientMap the map to maintain status and profile of clients.
	 */
	var clientMap = {};

	/**
	 * @property {Object} DEFAULT_CONFIG the default suggestion
	 */
	var DEFAULT_CONFIG = {
		css: config.css.default,
		data: {
			temperature: 'med'
		}
	};

	return {
		/**
		 * Register the client.
		 * @param {String} clientId the unique id to identify a client.
		 * @returns {Object} default suggestion (@link #DEFAULT_CONFIG}
		 */
		register: function (clientId) {
			return clientMap[clientId] = DEFAULT_CONFIG;
		},

		/**
		 * The main processing function to suggest options based on the surrounding data.
		 *
		 * @param {String} clientId the id of the client
		 * @param {Object} surroundingData the object contains environment information.
		 *
		 * @returns {Object} suggestion
		 *
		 * TODO: this is a basic POC logic. Need to replace it with a better algorithm.
		 */
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

		/**
		 * Un register client
		 * @param {String} clientId the id of the client.
		 */
		unregister: function (clientId) {
			clientMap[clientId] = null;
		}
	}
}());

// Export the module.
module.exports = process;


