const express = require('express');
const router =  express.Router();
const checkAuth = require('../middleware/check-auth');
const userDataModelControllers = require('../controllers/userDatas');

router.get('/', checkAuth, userDataModelControllers.get_all);
router.get('/:userId', checkAuth, userDataModelControllers.get_by_id);
router.post('/', checkAuth, userDataModelControllers.post_data);
router.delete('/:userId', checkAuth, userDataModelControllers.delete_data);

module.exports = router;