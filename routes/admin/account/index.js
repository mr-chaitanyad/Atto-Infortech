const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');

router.get('/login',
  accountController.getLogin
);

router.post('/login',
  accountController.postAdminLogin
);

router.get('/logout',
  accountController.getAdminLogout
);

router.get('/all/employees',
  accountController.requireRole(1),
  accountController.getAllEmployees
);

router.post('/create/employee',
  accountController.requireRole(1),
  accountController.postCreateEmployee
);

router.post('/view/password/:employee_id',
  accountController.requireRole(1),
  accountController.postViewPassword
);

router.post('/edit/employee/:employee_id',
  accountController.requireRole(1),
  accountController.postEditEmployee
);

router.post('/reset/employee/password/:',
  accountController.requireRole(1),
  accountController.postResetPassword
);

module.exports = router;