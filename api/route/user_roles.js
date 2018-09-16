const express =  require('express');
const router = express.Router();
const UserRoleControllers = require('../controllers/user_roles');

router.post('/', UserRoleControllers.userrole_create_role);
router.get('/', UserRoleControllers.userrole_get_all);
router.delete('/:roleId', UserRoleControllers.userrole_delete_role);

module.exports = router;