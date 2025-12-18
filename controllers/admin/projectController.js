const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const Assign = mongoose.model('Assign');
const SubTask = mongoose.model('SubTask');
const helper = require('../../handlers/helper');

exports.getProjectAll = async (req, res, next) => {
  try {
    const projectsPromise = Project.find()
      .populate({
        path: 'assignedEmployees',
        select: {
          name: 1
        }
      })
      .sort({
        createdAt: -1
      });
    const employeesPromise = User.find({
      role: 2,
      status: 'active'
    });
    const assignedPromise = Assign.find({
      removed: 0
    }, { project_id: 1 });

    const [projects, employees, assigned] = await Promise.all([projectsPromise, employeesPromise, assignedPromise])

    return res.render('admin/all-projects', {
      title: 'All projects',
      projects,
      employees,
      assigned: assigned.length ? assigned.map(assign => assign.project_id.toString()) : []
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "getProjectAll not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postCreateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      name: req.body.name
    });
    if (project) {
      req.flash('error', 'Project with same name already exist! Try different project.');
      return res.redirect('back');
    } else {
      const newProject = new Project({
        name: req.body.name,
        email: req.body.email,
        contactInfo: req.body.contactInfo,
        mobile: req.body.mobile,
        description: req.body.description,
        assignedEmployees: [],
        total_req_hour: req.body.total_req_hour,
        status: req.body.status || "active"
      })
      await newProject.save((err, result) => {
        if (err) {
          req.flash('error', 'Something went wrong!');
          return res.redirect('back');
        }
        req.flash('success', 'New project created!');
        return res.redirect('back');
      })
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "postCreateProject not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAssignTo = async (req, res, next) => {
  try {
    let promise = [];
    const project = await Project.findOne({
      _id: req.body.projectId
    });
    if (project) {
      project.assignedEmployees = req.body.assignTo;
      await project.save((err, result) => {
        if (err) {
          console.log('ERR IN PROJECT SAVE')
          console.log(err);
          return res.status(200).json({
            msg: 'failure',
            code: 400
          })
        } else {
          for (let employee of req.body.assignTo) {
            const newAssign = new Assign({
              project_id: req.body.projectId,
              employee_id: employee
            });
            newAssign.save((err, result) => {
              if (err) {
                console.log('ERR IN newAssign SAVE')
                console.log(err);
                return res.status(200).json({
                  msg: 'failure',
                  code: 400
                })
              }
              promise.push(result);
            })
          }
          Promise.all(promise)
            .then(result => {
              return res.status(200).json({
                msg: 'success',
                code: 200,
                data: {
                  name: project.name
                }
              })
            })
        }
      })
    } else {
      return res.json({
        msg: 'Project not found. try adding project first.',
        code: 400
      })
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAssignTo not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postEditProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.projectId },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          contactInfo: req.body.contactInfo,
          description: req.body.description,
          total_req_hour: req.body.total_req_hour,
          status: req.body.status
        }
      }
    ).exec((err, result) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
        return;
      }
      req.flash('success', 'Updated successfully!')
      return res.redirect('back');
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAssignTo not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAssignToUpdatee = async (req, res, next) => {
  try {
    let assEmpArr = [];
    const project = await Project.findOne({
      _id: req.body.projectId
    });
    if (project) {
      if (req.body.assignTo.length > project.assignedEmployees.length) {
        // employees add hue toh
        console.log('EMployees add hue');

        for (let [i, assign] of req.body.assignTo.entries()) {
          console.log(assign);

          if (project.assignedEmployees[i]) {
            console.log('UPDATE HUA')
            // update
            assEmpArr.push(assign);
          } else {
            console.log('CREATE HUA');
            // create
            assEmpArr.push(assign);
            const newAssign = new Assign({
              project_id: req.body.projectId,
              employee_id: assign
            });
            await newAssign.save();
          }
        }

        Promise.all(assEmpArr)
          .then(async result => {
            console.log('RESULT WALA');
            console.log(result);
            project.assignedEmployees = assEmpArr;
            await project.save();

            // for (let emp of assEmpArr) {
            //   let assign = await Assign.findOne({ removed: 0, project_id: req.body.projectId, employee_id: emp })
            //   if (assign) {
            //     // arul and shiv milenge

            //   } else {
            //     // vinayak nahi milega
            //   }
            // }
            return res.status(200).json({
              msg: 'success',
              code: 200,
              data: {
                name: project.name
              }
            })
          })

      } else if (req.body.assignTo.length < project.assignedEmployees.length) {
        // agar employees delete hue toh
        console.log('EMployees delete hue');

        for (let [i, assign] of project.assignedEmployees.entries()) {
          if (!req.body.assignTo[i]) {
            // update
          } else {
            // delete
          }
        }


        return res.status(200).json({
          msg: 'Employees delete hue',
          code: 200
        })

      } else if (req.body.assignTo.length == project.assignedEmployees.length) {
        // agar same no. of employees hue toh
        console.log('EMployees same no. hai');

        // update


        return res.status(200).json({
          msg: 'Employees same no. hai',
          code: 200
        })
      }
    } else {
      // project not found
      return res.status(200).json({
        msg: 'failure',
        code: 400
      })
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "postAssignTo not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAssignToUpdate = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.body.projectId
    });
    req.body.oldProject = project.assignedEmployees;
    if (project) {
      project.assignedEmployees = req.body.assignTo;
      await project.save();
      req.body.newProject = project;
    } else {
      return res.status(200).json({
        msg: 'failure',
        code: 400
      })
    }
    next();
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAssignToUpdate not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.extendPostAssignToUpdate = async (req, res, next) => {
  try {
    let promise = [];
    const oldAssignedEmp = req.body.oldProject;
    const newProject = req.body.newProject;
    const newAssEmpArr = req.body.assignTo;

    for(let [i, assign] of newAssEmpArr.entries()) {
      let foundAssign = await Assign.findOne({
        removed: 0,
        project_id: req.body.projectId,
        employee_id: assign
      });
      if(!foundAssign) {
        // create
        let newAssign = new Assign({
          project_id: req.body.projectId,
          employee_id: assign
        })
        await newAssign.save();
        promise.push(assign);
      }
    }
    Promise.all(promise)
      .then(result => {
        oldAssignedEmp.map(async (oldEmp) => {
          newProject.assignedEmployees.includes(oldEmp);
          if (!newProject.assignedEmployees.includes(oldEmp)) {
            // update removed: 1
            let foundAssign = await Assign.findOne({
              removed: 0,
              project_id: req.body.projectId,
              employee_id: oldEmp
            })
            foundAssign.removed = 1;
            await foundAssign.save();
          }
        });
        return res.status(200).json({
          msg: 'success',
          code: 200,
          data: {
            name: newProject.name
          }
        })
      })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "postAssignToUpdate not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getAddSubTask = async (req, res, next) => {
  try {
    let selProject;
    if (req.query.project_id) {
      selProject = await Project.findOne({
        _id: req.query.project_id
      })
    }
    const projects = await Project.find({
      status: 'active'
    })
    .sort({
      name: 1
    });
    res.render('admin/add-sub-task', {
      title: "Add Sub Task",
      project_id: req.query.project_id,
      projects,
      selProject: selProject || null
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "getAddSubTask not working - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAddSubTask = async (req, res, next) => {
  try {
    const projectType = req.body.project_id;

    const subTaskType = typeof req.body.sub_task == 'string' ? [req.body.sub_task] : req.body.sub_task;

    const mainObject = subTaskType.map((subTaskType, i) => ({
      project_id: projectType,
      sub_task: subTaskType,
    }));

    Promise.all(mainObject.map(async recordSubTask => {
      let newSubTask = new SubTask({
        project_id: recordSubTask.project_id,
        sub_task: recordSubTask.sub_task,
      })
      await newSubTask.save();
    }))
      .then(() => {
        req.flash('success', 'Sub Task Updated Successfully!');
        res.redirect('/admin/project/all');
        return;
      })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "postAddSubTask not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.subTaskAll = async (req, res, next) => {
  try {
    const subTasks = await SubTask
      .find()
      .populate({
        path: "project_id",
        select: {
          status: 1,
          name: 1
        }
      })
      .sort({
        createdAt: -1
      });

    return res.render('admin/all-sub-task', {
      title: 'All Sub Task',
      subTasks
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "subTaskAll not working - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.subTaskEdit = async (req, res, next) => {
  try {
    const projectsPromise = Project.find().sort({name: 1});
    const subTaskPromise = SubTask.findOne({
      _id: req.params.subtask_id
    })
      .populate({
        path: 'project_id',
        select: {
          name: 1
        }
      });

    const [projects, subTask] = await Promise.all([projectsPromise, subTaskPromise]);

    return res.render('admin/edit-sub-task', {
      title: 'Edit Sub Task',
      subTask,
      projects
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "subTaskEdit not working - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.subTaskEditPost = async (req, res, next) => {
  try {
    const subTask = await SubTask.findOneAndUpdate(
      { _id: req.params.subTask_id },
      {
        $set: {
          project_id: req.body.project_id,
          sub_task: req.body.sub_task,
          status: req.body.status
        }
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('/admin/project/sub/task/all');
        return;
      }
      req.flash('success', 'Updated!');
      res.redirect('/admin/project/sub/task/all');
      return;
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "subTaskEditPost not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getSubTaskByProjectID = async (req, res, next) => {
  try {
    const subtasks = await SubTask.find({
      project_id: req.params.project_id,
      status: 'active'
    }, { sub_task: 1 })
      .sort({
        createdAt: -1
      });

    return res.status(200).json({
      message: 'Sub tasks by project ID',
      code: 200,
      data: subtasks || []
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "getSubTaskByProjectID not working - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};