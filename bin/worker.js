// var exec = require('child_process').exec;
var vm = require('vm');
var vmResult = vm.runInThisContext(process.argv[2]);
// exports.addTask = function(task) {
	// var child = exec(process.argv[2]);

	// child.stdout.on('data', function(data) {
	//     console.log('stdout: ' + data);
	// });
	// child.stderr.on('data', function(data) {
	//     console.log('stderr: ' + data);
	// });
	// child.on('close', function(code) {
	//     console.log('closing code: ' + code);
	// });
// };
// console.log('vmResult: ', vmResult);
