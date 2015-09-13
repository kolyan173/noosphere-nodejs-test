var vm = require('vm');
var cluster = require('cluster');
var fs = require('fs');
var _ = require('lodash');
// var vmResult = vm.runInThisContext(process.argv[2]);
if (cluster.isMaster) {
	var numWorkers = require('os').cpus().length;

	console.log('Master cluster setting up ' + numWorkers + ' workers...');

	for(var i = 0; i < numWorkers; i++) {
		var worker = cluster.fork();
		
		worker.on('message', function(message) {
			console.log('MASTER - ', message);
	
			if (message.from === 'post') {
				for(var wid in cluster.workers) {
					cluster.workers[wid].send({
						type: 'add_task',
						from: 'master',
						task: message.data
					});
				}
			}

			if (message.type === 'task_result') {
				fs.appendFile('results.txt', JSON.stringify(message.data));
			}
		});

		worker.on('error', function(msg) {
			console.error(msg);
		});
	}

	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	cluster.on('exit', function(worker, code, signal) {
		console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
		console.log('Starting a new worker');
		
		var worker = cluster.fork();
		worker.on('message', function(message) {
			console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result);
		});
	});
} else {
	process.on('message', function(message) {
		if(message.type === 'add_task' && message.from === 'master') {
			var result = vm.runInThisContext(message.task.text);
			console.log(message);
			var data = _.assign(message.task, {
				result: result,
				workerPID: process.pid
			});
			process.send({
				type:'task_result',
				from: 'Worker ' + process.pid,
				data: data
			});
		}
	});
	require('../server');
}
