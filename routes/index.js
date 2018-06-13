var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController');

/* GET home page. */
router.get('/', userController.pbGet);

router.post('/', userController.addNew);

router.use('/:id', userController.delete);

module.exports = router;
