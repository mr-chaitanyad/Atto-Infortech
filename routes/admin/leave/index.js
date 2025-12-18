const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const leaveController = require('../../../controllers/admin/leaveController');

router.get('/test',
  leaveController.testAdminAPI
);

router.get('/all',
  accountController.requireRole(1, 2),
  leaveController.getLeaveAll
);

router.post('/create',
  accountController.requireRole(1, 2),
  leaveController.postCreateLeave
);

router.post('/approve/toggle',
  accountController.requireRole(1, 2),
  leaveController.postApproveToggle
);

router.post('/filter/date',
  accountController.requireRole(1, 2),
  leaveController.leaveFilterDate
);

router.post('/edit/:leave_id',
  accountController.requireRole(1, 2),
  leaveController.editLeave
);

router.get('/admin/add',
  accountController.requireRole(1, 2),
  leaveController.getAdminAddLeave
);

router.post('/admin/create',
  accountController.requireRole(1, 2),
  leaveController.postAdminLeave
);

router.get('/admin/update/:leave_id',
  accountController.requireRole(1, 2),
  leaveController.getAdminLeaveEdit
);

module.exports = router;