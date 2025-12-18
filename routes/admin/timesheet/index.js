const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const timesheetController = require('../../../controllers/admin/timesheetController');

router.get('/test',
  timesheetController.testAdminAPI
);

router.get('/',
  timesheetController.redirectToDashboard
);

router.get('/dashboard',
  accountController.requireRole(1, 2),
  timesheetController.getDashboard
);

router.get('/404',
  accountController.requireRole(1, 2),
  timesheetController.redirectToFourOhFour
);

router.get('/error',
  accountController.requireRole(1, 2),
  timesheetController.redirectToErr
);

// router.post('/dashboard/download/searched/product',
//   accountController.requireRole(1, 2),
//   timesheetController.downloadSearchedProduct
// );

module.exports = router;