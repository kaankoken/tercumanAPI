const express = require('express');
const router =  express.Router();
const checkAuth = require('../middleware/check-auth');
const userDataModelControllers = require('../controllers/userDatas');

router.get('/', checkAuth, userDataModelControllers.userData_get_all);
router.get('/:userId', checkAuth, userDataModelControllers.userData_get_by_id);
router.post('/', checkAuth, userDataModelControllers.userData_post_data);
router.delete('/:userId', checkAuth, userDataModelControllers.userData_delete_data);

module.exports = router;