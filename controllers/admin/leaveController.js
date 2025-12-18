const mongoose = require('mongoose');
const Leave = mongoose.model('Leave');
const User = mongoose.model('User');
const moment = require('moment-timezone');
const config = require('../../config/');
moment.tz.setDefault(config.timezone);
const helper = require('../../handlers/helper');

exports.testAdminAPI = (req, res, next) => {
  res.send('workng');
};

function formatDateText(dateRange) {
  if (!dateRange) return "";

  // Example input: "01/12/2025-05/12/2025"
  const [start, end] = dateRange.split("-");

  const startDate = moment(start, "DD/MM/YYYY", true);
  const endDate = moment(end, "DD/MM/YYYY", true);
  if (!startDate.isValid() || !endDate.isValid()) {
    // console.log("Invalid date:", dateRange);
    return "";
  }
  return `${startDate.format("MMM DD YYYY")} - ${endDate.format("MMM DD YYYY")}`;
}

// original version
// exports.getLeaveAll = async (req, res, next) => {
//   try {
//     let leaves;
//     const loggedInUser = req.session.user;

//     if (loggedInUser.role === 1) {

//       leaves = await Leave.find({})
//         .populate({
//           path: 'employee_id',
//           select: 'name dateRange leaveAllow'
//         })
//         .sort({ createdAt: -1 })
//         .lean();

//       for (const leave of leaves) {

//         const emp = leave.employee_id;

//         //  If dateRange is missing, invalid or empty
//         if (!emp.dateRange || typeof emp.dateRange !== "string" || !emp.dateRange.includes("-")) {
//           emp.dateRange = "N/A";
//           leave.remainingLeaves = "";
//           continue; // skip remaining logic
//         }

//         //  SAFE SPLIT
//         const parts = emp.dateRange.split('-');
//         if (parts.length !== 2) {
//           emp.dateRange = "N/A";
//           leave.remainingLeaves = "N/A";
//           continue;
//         }

//         const start = parts[0].trim();
//         const end = parts[1].trim();

//         //  Validate both sides contain DD/MM/YYYY
//         if (!start.includes('/') || !end.includes('/')) {
//           emp.dateRange = "N/A";
//           leave.remainingLeaves = "N/A";
//           continue;
//         }

//         const [d1, m1, y1] = start.split('/');
//         const [d2, m2, y2] = end.split('/');

//         //  Build valid JS dates
//         const rangeStart = new Date(`${y1}-${m1}-${d1} 00:00:00`);
//         const rangeEnd = new Date(`${y2}-${m2}-${d2} 23:59:59`);

//         //  Count leaves inside that range
//         const usedInRange = await Leave.aggregate([
//           {
//             $match: {
//               employee_id: emp._id,
//               $or: [
//                 { leave_start: { $gte: rangeStart, $lte: rangeEnd } },
//                 { leave_end: { $gte: rangeStart, $lte: rangeEnd } }
//               ]
//             }
//           },
//           {
//             $group: {
//               _id: null,
//               totalUsed: { $sum: "$total_days" }
//             }
//           }
//         ]);

//         const used = usedInRange.length ? usedInRange[0].totalUsed : 0;
//         const allowed = emp.leaveAllow || 0;

//         leave.remainingLeaves = allowed - used;
//       }
//       leaves = leaves.map(lv => {
//       lv.formattedDateRange = formatDateText(lv.employee_id.dateRange);
//       return lv;
//       });
//       // console.log(leaves);
//       return res.render("admin/admin-leave", {
//         title: "Leaves",
//         leaves
//       });
//     }

//   } catch (err) {
//     helper.errorDetailsForControllers(
//       err,
//       "getLeaveAll err - get request",
//       req.originalUrl,
//       req.body,
//       {},
//       "redirect",
//       __filename
//     );
//     next(err);
//     return;
//   }
// };


exports.getLeaveAll = async (req, res, next) => {
  try {
    let leaves;
    const loggedInUser = req.session.user;

    if (loggedInUser.role === 1) {

      // 🔹 Get leaves OLDEST → NEWEST (important for running balance)
      leaves = await Leave.find({})
        .populate({
          path: 'employee_id',
          select: 'name dateRange leaveAllow'
        })
        .sort({ createdAt: 1 })
        .lean();

      // 🔹 Track running balance per employee
      const employeeLeaveMap = {};

      for (const leave of leaves) {

        const emp = leave.employee_id;
        const empId = emp._id.toString();

        // ================= DATE RANGE (your existing logic) =================
        if (!emp.dateRange || typeof emp.dateRange !== "string" || !emp.dateRange.includes("-")) {
          emp.dateRange = "N/A";
        } else {
          const parts = emp.dateRange.split('-');
          if (parts.length === 2) {
            const start = parts[0].trim();
            const end = parts[1].trim();
            if (start.includes('/') && end.includes('/')) {
              emp.dateRange = emp.dateRange;
            } else {
              emp.dateRange = "N/A";
            }
          } else {
            emp.dateRange = "N/A";
          }
        }
        // ===================================================================

        // 🔹 Initialize allowed leaves once per employee
        if (employeeLeaveMap[empId] === undefined) {
          employeeLeaveMap[empId] = emp.leaveAllow || 0;
        }

        // 🔹 Previous remaining leaves
        leave.prevRemainingLeaves = employeeLeaveMap[empId];

        // 🔹 Deduct current leave
        employeeLeaveMap[empId] -= leave.total_days;

        // 🔹 Current remaining leaves
        leave.remainingLeaves = employeeLeaveMap[empId];
      }

      // 🔹 Latest leaves first (dashboard view)
      leaves.reverse();

      // 🔹 Keep your formatted date range
      leaves = leaves.map(lv => {
        lv.formattedDateRange = formatDateText(lv.employee_id.dateRange);
        return lv;
      });

      return res.render("admin/admin-leave", {
        title: "Leaves",
        leaves
      });
    }

  } catch (err) {
    helper.errorDetailsForControllers(
      err,
      "getLeaveAll err - get request",
      req.originalUrl,
      req.body,
      {},
      "redirect",
      __filename
    );
    next(err);
  }
};


exports.postCreateLeave = async (req, res, next) => {
  try {
    const leaveStartBody = req.body.leave_start;
    const leaveEndBody = req.body.leave_end;

    const leaveStart = new Date(leaveStartBody.split('-')[2], leaveStartBody.split('-')[1] - 1, leaveStartBody.split('-')[0]);
    const leaveEnd = new Date(leaveEndBody.split('-')[2], leaveEndBody.split('-')[1] - 1, leaveEndBody.split('-')[0]);
    const totalDays = moment(leaveEndBody, "DD-MM-YYYY").diff(moment(leaveStartBody, "DD-MM-YYYY"), 'days') + 1;

    const newLeave = new Leave({
      employee_id: req.session.user._id,
      leave_start: leaveStart,
      leave_end: leaveEnd,
      start_only_date: new Date(`${leaveStartBody.split('-')[2]}-${leaveStartBody.split('-')[1]}-${leaveStartBody.split('-')[0]} 00:00:00.000`),
      end_only_date: new Date(`${leaveEndBody.split('-')[2]}-${leaveEndBody.split('-')[1]}-${leaveEndBody.split('-')[0]} 00:00:00.000`),
      leave_start_obj: {
        l: moment(leaveStart).format('L'),
        ll: moment(leaveStart).format('LL'),
        plain_format: moment().format()
      },
      leave_end_obj: {
        l: moment(leaveEnd).format('L'),
        ll: moment(leaveEnd).format('LL'),
        plain_format: moment().format()
      },
      total_days: totalDays,
      leave_reason: req.body.leave_reason
    });

    await newLeave.save((err, result) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }
      req.flash('success', 'Leave added. Please wait for admin approval.');
      return res.redirect('back');
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "getLeaveAll err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postApproveToggle = async (req, res, next) => {
  try {
    const leave = await Leave.findOne({
      _id: req.body.id
    });

    leave.approved = leave.approved == 1 ? 0 : 1;
    await leave.save();
    return res.status(200).json({
      message: "Approval status changed!",
      type: 'success'
    })

  } catch (err) {
    helper.errorDetailsForControllers(err, "getLeaveAll err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.leaveFilterDate = async (req, res, next) => {
  try {
    let newArr = [];
    const currentUser = req.session.user;
    let leaves;

    if (currentUser.role == 1) {
      leaves = await Leave.find({
        leave_start: {
          $gte: new Date(`${req.body.start.year}-${req.body.start.month}-${req.body.start.date} 00:00:00.000`),
          $lte: new Date(`${req.body.end.year}-${req.body.end.month}-${req.body.end.date} 00:00:00.000`)
        }
      }).populate({
        path: 'employee_id',
        select: 'name dateRange leaveAllow'
      }).sort({ leave_start: -1 });
      if (leaves.length) {
        leaves.map(leave => {
          newArr.push([leave.employee_id.name, leave.leave_start_obj.ll, leave.leave_end_obj.ll, leave.total_days == 1 ? "1 day" : `${leave.total_days} days`, leave.leave_reason ? leave.leave_reason : "Not Provided", leave.employee_id.dateRange, leave.employee_id.leaveAllow]);
        })
        Promise.all(newArr).then(() => {
          return res.status(200).json({
            msg: 'success',
            code: 200,
            data: {
              newArr
            }
          });
        })
      } else {
        return res.status(200).json({
          msg: 'success',
          code: 200,
          data: {
            newArr
          }
        });
      }
    } else {
      leaves = await Leave.find({
        $and: [{
          employee_id: currentUser._id
        }, {
          leave_start: {
            $gte: new Date(`${req.body.start.year}-${req.body.start.month}-${req.body.start.date} 00:00:00.000`),
            $lte: new Date(`${req.body.end.year}-${req.body.end.month}-${req.body.end.date} 00:00:00.000`)
          }
        }]
      }).sort({ leave_start: -1 });
      if (leaves.length) {
        leaves.map(leave => {
          newArr.push([leave.leave_start_obj.ll, leave.leave_end_obj.ll, leave.total_days == 1 ? "1 day" : `${leave.total_days} days`, leave.approved == 1 ? "Yes" : "No"]);
        })
        Promise.all(newArr).then(() => {
          return res.status(200).json({
            msg: 'success',
            code: 200,
            data: {
              newArr
            }
          });
        })
      } else {
        return res.status(200).json({
          msg: 'success',
          code: 200,
          data: {
            newArr
          }
        });
      }
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "punchInNow api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.editLeave = async (req, res, next) => {
  try {
    const leaveStartBody = req.body.leave_start;
    const leaveEndBody = req.body.leave_end;

    const leaveStart = new Date(leaveStartBody.split('-')[2], leaveStartBody.split('-')[1] - 1, leaveStartBody.split('-')[0]);
    const leaveEnd = new Date(leaveEndBody.split('-')[2], leaveEndBody.split('-')[1] - 1, leaveEndBody.split('-')[0]);
    const totalDays = moment(leaveEndBody, "DD-MM-YYYY").diff(moment(leaveStartBody, "DD-MM-YYYY"), 'days') + 1;

    const updateLeave = await Leave.updateOne(
      { _id: req.params.leave_id },
      {
        $set: {
          employee_id: req.session.user._id,
          leave_start: leaveStart,
          leave_end: leaveEnd,
          start_only_date: new Date(`${leaveStartBody.split('-')[2]}-${leaveStartBody.split('-')[1]}-${leaveStartBody.split('-')[0]} 00:00:00.000`),
          end_only_date: new Date(`${leaveEndBody.split('-')[2]}-${leaveEndBody.split('-')[1]}-${leaveEndBody.split('-')[0]} 00:00:00.000`),
          leave_start_obj: {
            l: moment(leaveStart).format('L'),
            ll: moment(leaveStart).format('LL'),
            plain_format: moment().format()
          },
          leave_end_obj: {
            l: moment(leaveEnd).format('L'),
            ll: moment(leaveEnd).format('LL'),
            plain_format: moment().format()
          },
          total_days: totalDays,
          leave_reason: req.body.leave_reason
        }
      }
    ).exec((err, result) => {
      if (err) {
        helper.errorDetailsForControllers(err, "punchInNow api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
        next(err);
        return;
      }
      req.flash('success', 'Updated successfully.');
      res.redirect('back');
      return;
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "punchInNow api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getAdminAddLeave = async (req, res, next) => {
  try {
    const users = await User.find({ status: 'active' }, { name: 1 }).sort({ name: 1 });
    res.render("admin/admin-add-leave", {
      title: 'Add Leave',
      users
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "getAdminAddLeave err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAdminLeave = async (req, res, next) => {
  try {
    const leaveStartBody = req.body.leave_start;
    const leaveEndBody = req.body.leave_end;

    const leaveStart = new Date(leaveStartBody.split('-')[2], leaveStartBody.split('-')[1] - 1, leaveStartBody.split('-')[0]);
    const leaveEnd = new Date(leaveEndBody.split('-')[2], leaveEndBody.split('-')[1] - 1, leaveEndBody.split('-')[0]);
    const totalDays = moment(leaveEndBody, "DD-MM-YYYY").diff(moment(leaveStartBody, "DD-MM-YYYY"), 'days') + 1;

    const newLeave = new Leave({
      employee_id: req.body.emp_id,
      leave_start: leaveStart,
      leave_end: leaveEnd,
      start_only_date: new Date(`${leaveStartBody.split('-')[2]}-${leaveStartBody.split('-')[1]}-${leaveStartBody.split('-')[0]} 00:00:00.000`),
      end_only_date: new Date(`${leaveEndBody.split('-')[2]}-${leaveEndBody.split('-')[1]}-${leaveEndBody.split('-')[0]} 00:00:00.000`),
      leave_start_obj: {
        l: moment(leaveStart).format('L'),
        ll: moment(leaveStart).format('LL'),
        plain_format: moment().format()
      },
      leave_end_obj: {
        l: moment(leaveEnd).format('L'),
        ll: moment(leaveEnd).format('LL'),
        plain_format: moment().format()
      },
      total_days: totalDays,
      leave_reason: req.body.leave_reason
    });

    await newLeave.save((err, result) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }
      req.flash('success', 'Leave added!');
      return res.redirect('/admin/leave/all');
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAdminLeave err - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getAdminLeaveEdit = async (req, res, next) => {
  try {
    const users = await User.find({ status: 'active' }, { name: 1 }).sort({ name: 1 });
    const leave = await Leave.findOne({ _id: req.params.leave_id });
    return res.render('admin/admin-edit-leave', {
      title: 'Edit Leave',
      leave,
      users
    });
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAdminLeaveEdit err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};