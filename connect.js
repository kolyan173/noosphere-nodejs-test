var connect = module.exports = function() {
	var mongoose = require('mongoose');
	var credentials = require('./credentials');
	var options = {
		server: {
			socketOptions: { keepAlive: 1 }
		}
	};
	mongoose.connect(credentials.mongo.connectionString, options);
	mongoose.connection.on('connected', function() {
		console.log('Connected to mongodb');
	});
	mongoose.connection.on('error', console.log);
	mongoose.connection.on('disconnected', connect);
};