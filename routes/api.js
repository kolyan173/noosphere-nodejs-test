var express = require('express');
var task = require('./handlers/task');
var index = require('./handlers/index');
var router = express.Router();

router.get('/', index.html);

router.post('/', task.addTask);
router.get('/resultlist', task.resultlist);

module.exports = router;
