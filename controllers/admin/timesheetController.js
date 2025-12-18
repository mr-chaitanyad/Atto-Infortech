const mongoose = require('mongoose');
const User = mongoose.model('User');
const _ = require("lodash");
const helper = require('../../handlers/helper');

exports.testAdminAPI = (req, res, next) => {
  try {
    return res.send('Admin API Works!!');
  } catch (err) {
    helper.errorDetailsForControllers(err, "test admin api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    return res.render('admin/dashboard', {
      title: "Dashboard"
    });
  } catch (err) {
    helper.errorDetailsForControllers(err, "get dashboard err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.redirectToDashboard = (req, res, next) => {
  try {
    return res.redirect('/admin/dashboard');
  } catch (err) {
    helper.errorDetailsForControllers(err, "redirect to dashboard - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.redirectToFourOhFour = (req, res, next) => {
  try {
    return res.render('admin/404', { title: '404' });
  } catch (err) {
    helper.errorDetailsForControllers(err, "redirect to 404 - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.redirectToErr = (req, res, next) => {
  try {
    return res.render('admin/errorAdmin', { title: 'Something went wrong' });
  } catch (err) {
    helper.errorDetailsForControllers(err, "redirect to something went wrong - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};