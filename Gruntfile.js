'use strict';

module.exports = function (grunt) {

	// Define the configuration for all the tasks
	grunt.initConfig({

		watch: {
			js: {
				files: ['web-client/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'web-client/{,*/}*.html'
				]
			}
		},

		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					base: 'web-client'
				}
			}
		},

		execute: {
			service: {
				src: ['src/main.js']
			},

			nodeclient: {
				src: ['node-clients/testClient1.js']
			}
		},

		docco: {
			dist: {
				src: ['config.js', 'src/**/*.js', 'web-client/scripts/**/*.js', 'node-clients/*.js'],
				options: {
					destination: 'docs'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-execute');
	grunt.loadNpmTasks('grunt-docco');

	// Run web-client
	grunt.registerTask('serve', 'Compile then start a connect web server', ['connect:livereload', 'watch']);
	// Run aware service
	grunt.registerTask('service', 'Starts the aware service', ['execute:service']);
	// Run node client
	grunt.registerTask('node-client', 'Starts node client', ['execute:nodeclient']);
	// Generate Doc
	grunt.registerTask('gen-doc', 'Generate documentation', ['docco']);
};
