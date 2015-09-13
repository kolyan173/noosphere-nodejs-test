var express = require('express'),
	bodyParser = require('body-parser'),
	path = require('path'),
	methodOverride = require('method-override'),
	mongoose = require('mongoose'),
	ejs = require('ejs'),
	expressLayouts = require('express-ejs-layouts'),
	passport = require('passport'),
	fs = require('fs'),
	credentials = require('credentials'),
	port = process.env.PORT || 3000,
	server = express(),

var connect = function () {
	var options = { server: { socketOptions: { keepAlive: 1 } } };
	mongoose.connect(credentials.mongo.connectionString, options);
	mongoose.connection.on('error', console.log);
	mongoose.connection.on('disconnected', connect);
};
connect();

server.use(
	bodyParser.urlencoded({extended: true})
);
server.use(bodyParser.json());
server.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method
		delete req.body._method
		return method
	}
}));

server.use('/api', require('./routes/api'));

server.get('/', function(req, res) {
 	res.sendFile(path.join(__dirname,'index.html'));
});

// server.post('/', 
// 	function(req, res) {
// 	process.send({
// 		from: 'post',
// 		data: {
// 			text: req.body.task,
// 			timsestamp: Date.now()
// 		}
// 	});
// 	res.redirect('/');
// });

// server.get('/results', function(req, res) {
// 	fs.readFile('results.txt', 'utf8', function(err, data) {
// 		res.send(data.wo);
// 	});
// });

server.listen(port, function() {
	console.log('Start server on port:', port);
});

server.use(function(req, res, next){
	res.status(404)
		.send('Server not found');
});

server.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500)
		.send('Server error');
});
