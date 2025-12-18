const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const config = require('../../config/');
moment.tz.setDefault(config.timezone);
const User = require('../../models/User');
const helper = require('../../handlers/helper');
const utils = require('../../utils/helper');

// FORMAT DATE FUNCTION
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

exports.getLogin = (req, res, next) => {
  res.render('admin/login', {
    title: 'Login'
  });
  return;
};

// @route
// @desc   Auth Middleware
// @access
exports.requireRole = (...allowed) => {
  const isAllowed = role => allowed.indexOf(role) > -1;
  return (req, res, next) => {
    if (req.session.user && isAllowed(req.session.user.role)) {
      next();
      return;
    } else if (req.session.user && isAllowed(req.session.user.role)) {
      req.flash('You do not belong here!');
      res.redirect('back');
      return;
    } else {
      req.flash('error', 'Please sign in!');
      res.redirect('/admin/account/login');
      return;
    }
  }
};

exports.postAdminLogin = async (req, res, next) => {
  try {
    const emailLowerCase = req.body.email.toLowerCase();
    const adminUser = await User.findOne({
      $and: [{
          email: emailLowerCase
        },
        {
          status: 'active'
        }
      ]
    });
    if (adminUser) {
      bcrypt.compare(req.body.password, adminUser.password, function (err, result) {
        if (result == true) {
          delete adminUser.password;
          req.session.user = {_id: adminUser._id, status: adminUser.status, type: adminUser.type, role: adminUser.role, name: adminUser.name, email: adminUser.email, encryptedKey: adminUser.encryptedKey, mobile: adminUser.mobile, resource_based: adminUser.resource_based};
          req.session.cookie.maxAge = parseInt(req.config.userSession.maxAge);
          res.status(200).json({
            code: 200,
            message: 'You are now logged in!'
          });
          return;
        } else {
          res.status(200).json({
            code: 500,
            message: 'Password do not match.'
          });
          return;
        }
      });
    } else {
      res.status(200).json({
        code: 404,
        message: 'You are not authorized!.'
      });
      return;
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "admin login not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getAdminLogout = (req, res, next) => {
  req.session.user = null;
  req.flash('success', 'You are now logged out!')
  res.redirect('/admin/account/login');
  return;
};

// GET ALL EMPLOYEES
exports.getAllEmployees = async (req, res, next) => {
  try {
    let allEmployees = await User.find({ role: 2 });

    allEmployees = allEmployees.map(emp => {
      emp.formattedDateRange = formatDateText(emp.dateRange);
      return emp;
    });

    return res.render('admin/all-employees', {
      title: "All Employees",
      allEmployees
    });

  } catch (err) {
    helper.errorDetailsForControllers(err, "getAllEmployees function not working", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postCreateEmployee = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }

      const newEmployee = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        encryptedKey: utils.textEncrypter(req.body.password),
        mobile: req.body.mobile,
        type: req.body.role == 1 ? "admin" : "employee",
        role: req.body.role,
        // dateRange: req.body.dateRange,
        dateRange:
        req.body.dateRange && req.body.dateRange.trim() !== ""
          ? req.body.dateRange
          : "",
        leaveAllow: req.body.leaveAllow,
        status: req.body.status,
        resource_based: req.body.resource_based,
        type: req.body.type
      });

      await newEmployee.save((err, result) => {
        if (err) {
          req.flash('error', 'Something went wrong!');
          return res.redirect('back');
        }
        req.flash('success', 'New Employee Created!');
        return res.redirect('back');
      });
    });

  } catch (err) {
    helper.errorDetailsForControllers(err, "postCreateEmployee not working", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postViewPassword = async (req, res, next) => {
  try {
    const employee = await User.findOne({
      role: 2,
      _id: req.params.employee_id
    });

    if (employee) {
      bcrypt.compare(req.body.emp_password, employee.password, function (err, result) {
        if (err) {
          return res.status(400).json({
            err: err,
            msg: 'Something went wrong!',
            code: 400
          });
        }
        if (result == true) {
          return res.status(200).json({
            msg: 'success',
            code: 200,
            name: employee.name,
            password: utils.textDecrypter(employee.encryptedKey)
          });
        } else {
          return res.status(200).json({
            msg: 'failure',
            code: 401
          });
        }
      });
    } else {
      return res.status(200).json({
        msg: 'Something went wrong!',
        code: 402
      });
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "postViewPassword not working", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postEditEmployee = async (req, res, next) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.employee_id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          role: req.body.role,
          // dateRange: req.body.dateRange || "",
          dateRange:
          req.body.dateRange && req.body.dateRange.trim() !== ""
            ? req.body.dateRange
            : "",
          leaveAllow: req.body.leaveAllow,
          type: req.body.role == 1 ? "admin" : "employee",
          status: req.body.status,
          resource_based: req.body.resource_based
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
    });

  } catch (err) {
    helper.errorDetailsForControllers(err, "postEditEmployee not working", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postResetPassword = async (req, res, next) => {
  try {
    bcrypt.hash(req.body.reset_password, 10, async (err, hash) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        return res.redirect('back');
      }

      await User.findOneAndUpdate(
        { _id: req.params.employee_id },
        {
          $set: { password: hash }
        }
      ).exec((err, result) => {
        if (err) {
          req.flash('error', 'Something went wrong!');
          return res.redirect('back');
        }
        req.flash('success', 'Password updated successfully!')
        return res.redirect('back');
      });
    });

  } catch (err) {
    helper.errorDetailsForControllers(err, "postResetPassword not working", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};
