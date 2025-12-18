const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const reportController = require('../../../controllers/admin/reportController');

router.get('/test',
  reportController.test
);

router.get('/view',
  accountController.requireRole(1),
  reportController.viewReports
);

router.post('/view/details/employees',
  accountController.requireRole(1),
  reportController.viewDetails
);

router.post('/filter',
  accountController.requireRole(1),
  reportController.filterDetails
);

router.post('/view/details/employees/by/date',
  accountController.requireRole(1),
  reportController.viewDetailsByDate
);

router.post('/view/employee/notes',
  accountController.requireRole(1),
  reportController.viewEmployeeNotes
);

router.get('/export/excel',
  accountController.requireRole(1),
  reportController.exportToExcel
);

module.exports = router;