var exec = require('child_process').exec;

exports.addTask = function(task) {
	console.log('addTask');
	var child = exec(task);

	child.stdout.on('data', function(data) {
	    console.log('stdout: ' + data);
	});
	child.stderr.on('data', function(data) {
	    console.log('stderr: ' + data);
	});
	child.on('close', function(code) {
	    console.log('closing code: ' + code);
	});
	child.on('error', function(err) {
	    console.log('error: ' + code);
	});
};
