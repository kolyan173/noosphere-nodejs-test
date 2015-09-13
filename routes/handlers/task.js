var Task = require('../../models/Task');

module.addTask = function(req, res) {
	process.send({
		from: 'post',
		data: {
			text: req.body.task,
			timsestamp: Date.now()
		}
	});
	res.redirect('/');
};

exports.resultList = function(req, res) {
	Task().find(function(err, items) {
		res.json({ items: items });
	});
};