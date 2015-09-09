var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var server = express();
var port = process.env.PORT || 3000;
var router = express.Router();
var daemon = require('./bin/daemon');

server.use(bodyParser.urlencoded());
server.use(bodyParser.json());
server.use(methodOverride(function(req, res) {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		var method = req.body._method
		delete req.body._method
		return method
	}
}));

server.get('/', function(req, res){
  var html = '<form action="/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="task" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';
               
  res.send(html);
});

server.post('/', function(req, res) {
	daemon(req.body.task);
	res.redirect('/');
});

server.listen(port);
