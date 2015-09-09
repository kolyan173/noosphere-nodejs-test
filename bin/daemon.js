
// Everything above this line will be executed twice
// require('daemon')();
var cluster = require('cluster');
// Number of CPUs
var numCPUs = require('os').cpus().length;
var commandHandler = require('../app').addTask;
/**
* Creates a new worker when running as cluster master.
* Runs the HTTP server otherwise.
*/
function createWorker(task) {
	debugger;
	console.log('numCPUs', numCPUs);
	if (cluster.isMaster) {
		// Fork a worker if running as cluster master
		var child = cluster.fork();
		// Respawn the child process after exit
		// (ex. in case of an uncaught exception)
		child.on('exit', function (code, signal) {
			createWorker(task);
		});
	} else {
		// Run the HTTP server if running as worker
		commandHandler(task);
	}
}
/**
* Creates the specified number of workers.
* @param  {Number} n Number of workers to create.
*/
function createWorkers(task) {
	var i = numCPUs;
	while (i-- > 0) {
		createWorker(task);
	}
}
/**
* Kills all workers with the given signal.
* Also removes all event listeners from workers before sending the signal
* to prevent respawning.
* @param  {Number} signal
*/
function killAllWorkers(signal) {
	var uniqueID,
	worker;
	for (uniqueID in cluster.workers) {
		if (cluster.workers.hasOwnProperty(uniqueID)) {
			worker = cluster.workers[uniqueID];
			worker.removeAllListeners();
			worker.process.kill(signal);
		}
	}
}
/**
* Restarts the workers.
*/
// process.on('SIGHUP', function () {
// 	killAllWorkers('SIGTERM');
// 	createWorkers(numCPUs * 2);
// });
// *
// * Gracefully Shuts down the workers.

// process.on('SIGTERM', function () {
// 	killAllWorkers('SIGTERM');
// });
// createWorkers('node -v');
module.exports = createWorkers;
