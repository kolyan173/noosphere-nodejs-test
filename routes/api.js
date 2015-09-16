var express = require('express');
var task = require('./handlers/task');
var init = require('./handlers/init');
var router = express.Router();

router.post('/addTask', task.addTask);

module.exports = router;
