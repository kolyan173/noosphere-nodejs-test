
// // Everything above this line will be executed twice
// // require('daemon')();
// var cluster = require('cluster');
// // Number of CPUs
// var numCPUs = require('os').cpus().length;
// var commandHandler = require('../app').addTask;
// /**
// * Creates a new worker when running as cluster master.
// * Runs the HTTP server otherwise.
// */
// function createWorker(task) {
// 	debugger;
// 	console.log('numCPUs', numCPUs);
// 	if (cluster.isMaster) {
// 		// Fork a worker if running as cluster master
// 		var child = cluster.fork();
// 		// Respawn the child process after exit
// 		// (ex. in case of an uncaught exception)
// 		child.on('exit', function (code, signal) {
// 			createWorker(task);
// 		});
// 	} else {
// 		// Run the HTTP server if running as worker
// 		commandHandler(task);
// 	}
// }
// /**
// * Creates the specified number of workers.
// * @param  {Number} n Number of workers to create.
// */
// function createWorkers(task) {
// 	var i = numCPUs;
// 	while (i-- > 0) {
// 		createWorker(task);
// 	}
// }
// /**
// * Kills all workers with the given signal.
// * Also removes all event listeners from workers before sending the signal
// * to prevent respawning.
// * @param  {Number} signal
// */
// function killAllWorkers(signal) {
// 	var uniqueID,
// 	worker;
// 	for (uniqueID in cluster.workers) {
// 		if (cluster.workers.hasOwnProperty(uniqueID)) {
// 			worker = cluster.workers[uniqueID];
// 			worker.removeAllListeners();
// 			worker.process.kill(signal);
// 		}
// 	}
// }
// /**
// * Restarts the workers.
// */
// process.on('SIGHUP', function () {
// 	killAllWorkers('SIGTERM');
// 	createWorkers(numCPUs);
// });

//  // Gracefully Shuts down the workers.
// process.on('SIGTERM', function () {
// 	console.log('SIGTERM is called');
// 	killAllWorkers('SIGTERM');
// });
// createWorkers('node -v');
// // module.exports = createWorkers;

var cluster = require('cluster');
var path = require('path');
console.log('CALLLED');

module.exports = function(task) {
	console.log('INSIDE');
	var config = {
	    numWorkers: require('os').cpus().length,
	};

	cluster.setupMaster({
	    exec: path.join(__dirname, "worker.js"),
	    args: [task]
	});

	// Fork workers as needed.
	for (var i = 0; i < config.numWorkers; i++) {
		var worker = cluster.fork();
		worker.on('message', function(message) {
			console.log(message.from + ': ' + message.type + ' ' + message.data.number + ' = ' + message.data.result);
		});
	}

	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online');
	});

	cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
};





























