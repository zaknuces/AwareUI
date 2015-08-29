// Application Configuration
// -----------------------
var config = {};

// web: it contains config settings related to web interface. Like ports.
config.web = {
	address: 'localhost',
	port: 9980,
	protocol: 'aware',
	staticContent: {
		port: 7000
	}
};

// css: the url of the css files that user can access.
config.css = {
	default: 'http://localhost:7000/theme_default.css',
	high: 'http://localhost:7000/theme_high.css'
};

// Export config module
module.exports = config;