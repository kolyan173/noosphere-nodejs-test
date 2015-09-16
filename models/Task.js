var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = Schema({
	text: { type: String, default: '' },
	result: { type: String, default: '' },
	workerPID: { type: String, default: '' },
	timestamp: { type: Date, default: Date.now },
	_creator: { type: String, ref: 'User' }
});

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;