var express = require('express');
var router = express.Router();

const { pbGet, pbAdd, pbDelete } = require('../controllers/userController');
const { pbSearch } = require('../controllers/searchController');

router.get('/', pbGet);

router.post('/add', pbAdd);

router.post('/search', pbSearch);

router.use('/delete/(:id)', pbDelete);

module.exports = router;
