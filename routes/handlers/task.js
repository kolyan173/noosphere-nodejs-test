var Task = require('../../models/Task');
var User = require('../../models/User');

exports.addTask = function(req, res) {
	process.send({
		type: 'addTaskHandler',
		data: {
			text: req.body.task,
			_creator: req.session.passport.user
		}
	});
	res.redirect('/');
};

exports.resultList = function(req, res) {
	Task.find({_creator: req.session.passport.user})
		.exec(function(err, items) {
			res.render('results', {
				results: items,
				headColumns: [
					'workerPID',
					'timestamp',
					'text',
					'result'
				]			
			});
		});
};