const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const trackerController = require('../../../controllers/admin/trackerController');

router.get('/test',
  trackerController.testAdminAPI
);

router.get('/track/:userId',
  trackerController.trackerTime
);

router.post('/punchin/:userId',
  trackerController.punchInNow
);

router.post('/punchout/:userId',
  trackerController.punchOutNow
);

router.post('/filter/date',
  trackerController.getTrackerByDate
);

module.exports = router;