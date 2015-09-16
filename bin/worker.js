var Task = require('../models/Task');

process.on('message', function(msg) {
	if(msg.type === 'handleTaskResult') {
		new Task(msg.data).save(function(err) {
			console.error(err);
		});
	}
});
