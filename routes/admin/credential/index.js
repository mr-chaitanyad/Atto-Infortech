const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const credentialController = require('../../../controllers/admin/credentialController');

router.get('/test',
  accountController.requireRole(1, 2),
  credentialController.testAdminAPI
);

router.get('/all',
  accountController.requireRole(1, 2),
  credentialController.getAllCredentials
);

router.post('/add',
  accountController.requireRole(1, 2),
  credentialController.postAddCredentials
);

router.post('/edit/:cred_id',
  accountController.requireRole(1, 2),
  credentialController.postEditCredentials
);

module.exports = router;