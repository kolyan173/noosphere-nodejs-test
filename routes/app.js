var express = require('express');
var router = express.Router();
var task = require('./handlers/task');
var init = require('./handlers/init');

router.get('/', init.index);
router.get('/login', init.login);
router.post('/auth', init.auth);
router.get('/resultlist', task.resultList);

module.exports = router;
