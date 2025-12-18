const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const timeRecordController = require('../../../controllers/admin/timeRecordController');

router.get('/test',
  timeRecordController.testAdminAPI
);

router.get('/view',
  accountController.requireRole(1, 2),
  timeRecordController.viewTimesheet
);

router.get('/create',
  accountController.requireRole(1, 2),
  timeRecordController.createTimesheet
);

router.post('/create',
  accountController.requireRole(1, 2),
  timeRecordController.postCreateTimesheet
);

router.post('/filter/by/date',
  accountController.requireRole(1, 2),
  timeRecordController.filterTimesheetByDate
);

router.get('/edit/:timesheet_id',
  accountController.requireRole(2),
  timeRecordController.editTimesheet
);

router.post('/edit/:timesheet_id',
  accountController.requireRole(2),
  timeRecordController.postEditTimesheet
);

router.get('/jq/record',
  // accountController.requireRole(1, 2),
  timeRecordController.getJQRecord
);

router.get('/jq/emp/record',
  // accountController.requireRole(1, 2),
  timeRecordController.getEmpJQRecord
);

router.get('/test/record',
  // accountController.requireRole(1, 2),
  timeRecordController.getTestRecord
);

router.post('/delete/record',
  // accountController.requireRole(1, 2),
  timeRecordController.postDeleteRecord
);

router.get('/export',
  timeRecordController.exportTimesheet
);

module.exports = router;
