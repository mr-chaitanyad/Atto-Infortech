const mongoose = require('mongoose');
const Credential = mongoose.model('Credential');
const moment = require('moment');
const helper = require('../../handlers/helper');

exports.testAdminAPI = (req, res, next) => {
  return res.json('working');
};

exports.getAllCredentials = async (req, res, next) => {
  try {
    const credentials = await Credential
      .find()
      .populate({
        path: 'updated_by',
        select: {
          name: 1
        }
      })
      .sort({
        createdAt: -1
      });

    res.render('admin/all-credentials', {
      title: 'All Credentials',
      credentials,
      moment
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "getAllCredentials err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postAddCredentials = async (req, res, next) => {
  try {
    const newCredential = new Credential({
      project_name: req.body.project_name,
      notes: req.body.notes,
      updated_by: req.session.user._id
    });
    await newCredential.save((err, result) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
        return;
      }
      req.flash('success', 'Saved successfully!');
      res.redirect('back');
      return;
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "postAddCredentials err - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postEditCredentials = async (req, res, next) => {
  try {
    const updateCred = await Credential.findOneAndUpdate(
      { _id: req.params.cred_id },
      {
        $set: {
          notes: req.body.notes,
          updated_by: req.session.user._id,
          updatedAt: Date.now()
        }
      }
    ).exec((err, result) => {
      if (err) {
        req.flash('error', 'Something went wrong!');
        res.redirect('back');
        return;
      }
      req.flash('success', 'Updated successfully!');
      res.redirect('back');
      return;
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "postEditCredentials err - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};
