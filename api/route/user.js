const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const UserControllers =  require('../controllers/user');

router.post('/signup', UserControllers.user_signup);

router.post('/login', UserControllers.user_login);

router.get('/', UserControllers.user_get_all);

router.delete('/:userId', checkAuth, UserControllers.user_delete_user);
module.exports = router;