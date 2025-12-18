const express = require('express');
const router = express.Router();
const timesheetController = require('../../../controllers/api/timesheetController');

router.get('/',
  timesheetController.test
);

module.exports = router;