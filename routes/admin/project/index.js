const express = require('express');
const router = express.Router();
const accountController = require('../../../controllers/admin/accountController');
const projectController = require('../../../controllers/admin/projectController');

router.get('/all',
  accountController.requireRole(1),
  projectController.getProjectAll
);

router.post('/create',
  accountController.requireRole(1),
  projectController.postCreateProject
);

router.post('/assign/to',
  accountController.requireRole(1),
  projectController.postAssignTo
);

router.post('/edit/:projectId',
  accountController.requireRole(1),
  projectController.postEditProject
);

router.post('/assign/to/update',
  accountController.requireRole(1),
  projectController.postAssignToUpdate,
  projectController.extendPostAssignToUpdate
);

router.get('/add/sub/task',
  accountController.requireRole(1),
  projectController.getAddSubTask
);

router.post('/add/sub/task',
  accountController.requireRole(1),
  projectController.postAddSubTask
);

router.get('/sub/task/all',
  accountController.requireRole(1),
  projectController.subTaskAll
);

router.get('/edit/sub/task/:subtask_id',
  accountController.requireRole(1),
  projectController.subTaskEdit
);

router.post("/edit/sub/task/:subTask_id",
  accountController.requireRole(1),
  projectController.subTaskEditPost
);

router.get('/get/sub/task/by/project_id/:project_id',
  projectController.getSubTaskByProjectID
);

module.exports = router;