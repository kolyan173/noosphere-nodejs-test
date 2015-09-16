var express = require('express'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	path = require('path'),
	methodOverride = require('method-override'),
	ejs = require('ejs'),
	expressLayouts = require('express-ejs-layouts'),
	passport = require('passport'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	port = process.env.PORT || 3000,
	server = express();

require('./connect')();

server.use(express.static(__dirname + '/public'));

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

require('./lib/auth')(passport);

server.use(cookieParser('secret'));
server.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

server.use(passport.initialize());
server.use(passport.session());

server.listen(port, function() {
	console.log('Start server on port:', port);
});

server.set('views', __dirname + '/views');
server.set('view engine', 'ejs');
server.set('layout', 'layout');

server.use(function(req, res, next) {
	if (req.isAuthenticated() || ~['/login', '/auth'].indexOf(req.path)) {
		next();
	} else {
		res.redirect('/login');
	}
});

server.use(expressLayouts);

server.use('/api', require('./routes/api'));
server.use(require('./routes/app'));

server.use(function(req, res, next){
	res.status(404)
		.send('Server not found');
});

server.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500)
		.send('Server error');
});
