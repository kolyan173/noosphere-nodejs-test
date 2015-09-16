var vm = require('vm');
var cluster = require('cluster');
var fs = require('fs');
var _ = require('lodash');
var Task = require('../models/Task');
var workerHandle = require('./worker');

if (cluster.isMaster) {
	var numWorkers = require('os').cpus().length;

	console.log('Master cluster setting up ' + numWorkers + ' workers...');

	for(var i = 0; i < numWorkers; i++) {
		var worker = cluster.fork();
		
		worker.on('message', function(message) {
			switch(message.type) {
				case 'addTaskHandler':
					for(var wid in cluster.workers) {
						cluster.workers[wid].send({
							type: 'add_task',
							from: 'master',
							task: message.data
						});
					}
					break;
				case 'task_result':
					worker.send({
						from: 'master',
						type: 'handleTaskResult',
						data: message.data
					});
					break;
				default:
					break;
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
			var data = _.assign(message.task, {
				result: result.toString(),
				workerPID: process.pid.toString()
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
