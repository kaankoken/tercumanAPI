const express = require('express');
const router =  express.Router();
const checkAuth = require('../middleware/check-auth');
const userDataModelControllers = require('../controllers/userDatas');

router.get('/', checkAuth, userDataModelControllers.get_all);
router.post('/', checkAuth, userDataModelControllers.post);
router.delete('/', checkAuth);

module.exports = router;