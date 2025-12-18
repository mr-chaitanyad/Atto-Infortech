const mongoose = require('mongoose');
const Tracker = mongoose.model('Tracker');
const _ = require("lodash");
const moment = require('moment-timezone');
const config = require('../../config/');
moment.tz.setDefault(config.timezone);
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

exports.trackerTime = async (req, res, next) => {
  try {
    const config = req.config;
    const loggedInUser = req.session.user;

    if (loggedInUser.role === parseInt(config.roles.admin)) {
      console.log('INSIDE ADMIN');

      // aaj k date ka entries aayega
      const trackers = await Tracker.find({
        'date_time_obj.l': moment().format('L')
      })
      .populate({
        path: 'employee_id',
        select: {
          name: 1
        }
      });
      res.render('admin/tracker-admin', {
        title: 'Tracker',
        trackers: trackers || [],
        moment,
        trackerHTML: 0,
      })
    } else {
      console.log('INSIDE EMPLOYEE');
      let time = moment(moment(moment()).format("HH:mm"), "HH:mm");
      let lock = time.isBetween(moment("22:45:00", "HH:mm"), moment("23:59:59", "HH:mm"))
      let todayTrack;
      const checkPunch = await Tracker.findOne({
        employee_id: req.params.userId,
        punch_in: 1,
        punch_out: 0,
        'date_time_obj.l': moment().format('L')
      });
      todayTrack = await Tracker.find({
        employee_id: req.params.userId,
        punch_in: 1,
        punch_out: 1,
        'date_time_obj.l': moment().format('L')
      }, {
        'date_time_obj.ll': 1, 'date_time_obj.lt': 1, 'date_time_obj_out.lt': 1, 'time_diff.diff': 1
      })
      .populate({
        path: "employee_id",
        select: {
          name: 1
        }
      })
      if (checkPunch) {
        res.render('admin/tracker-employee', {
          title: 'Tracker',
          trackerHTML: 1,
          punchIn: checkPunch.punch_in,
          punchOut: checkPunch.punch_out,
          userId: req.params.userId,
          showTimer: 1,
          tracker: checkPunch,
          todayTrack: todayTrack,
          lock
        })
      } else {
        res.render('admin/tracker-employee', {
          title: 'Tracker',
          trackerHTML: 1,
          punchIn: 0,
          punchOut: 0,
          userId: req.params.userId,
          showTimer: 0,
          tracker: null,
          todayTrack: todayTrack,
          lock
        })
      }
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "test admin api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.punchInNow = async (req, res, next) => {
  try {
    // console.log(`Your device information: ${JSON.stringify(req.useragent)}`);
    const deviceData = req.useragent;

    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    // const trackerFound = await Tracker.findOne({
    //   employee_id: req.params.userId,
    //   punch_in: 1,
    //   punch_out: 0,
    //   'date_time_obj.l': moment().format('L')
    // });
    let time = moment(moment(moment()).format("HH:mm"), "HH:mm");
    let lock = time.isBetween(moment("22:45:00", "HH:mm"), moment("23:59:59", "HH:mm"));

    if (!lock) {
      const newTracker = new Tracker({
        employee_id: req.params.userId,
        current_date_time: Date.now(),
        punch_in: 1,
        punch_in_time: Date.now(),
        date_punch: new Date(`${year}-${month}-${day} 00:00:00.000`),
        type: "",
        punch_in_ip: req.body.punchInIP,
        punch_out_ip: "",
        date_time_obj: {
          lt: moment().format('LT'),
          lts: moment().format('LTS'),
          l: moment().format('L'),
          ll: moment().format('LL'),
          lll: moment().format('LLL'),
          llll: moment().format('LLLL'),
          dddd: moment().format('dddd'),
          plain_format: moment().format()
        },
        deviceInfoIn: {
          browser: deviceData.browser,
          version: deviceData.version,
          os: deviceData.os,
          platform: deviceData.platform,
          geoIp: deviceData.geoIp,
          source: deviceData.source
        }
      });
      await newTracker.save((err, result) => {
        if (err) {
          return res.status(200).json({
            msg: 'failure',
            code: 400
          })
        }
        return res.status(200).json({
          msg: 'success',
          code: 200,
          data: newTracker
        })
      })
    } else {
      return res.status(200).json({
        msg: 'success',
        code: 310
      })
    }
  } catch(err) {
    helper.errorDetailsForControllers(err, "punchInNow api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.punchOutNow = async (req, res, next) => {
  try {
    // console.log(`Your device information: ${JSON.stringify(req.useragent)}`);
    const deviceData = req.useragent;

    const trackerFound = await Tracker.findOne({
      employee_id: req.params.userId,
      punch_in: 1,
      punch_out: 0,
      'date_time_obj.l': moment().format('L')
    });

    if (trackerFound) {
      // time difference
      // let startTime = moment(trackerFound.date_time_obj.plain_format);
      // let endTime = moment(moment().format());

      let startTime = moment(trackerFound.date_time_obj.plain_format);
      let endTime = moment(moment().format());
      let duration = moment.duration(endTime.diff(startTime));
      const hourDiff = parseInt(duration.asHours());
      const minDiff = parseInt(duration.asMinutes()) % 60;

      // new update tracker
      const updateTracker = await Tracker.updateOne({
        employee_id: req.params.userId,
        punch_in: 1,
        punch_out: 0,
        'date_time_obj.l': moment().format('L')
      }, {
        $set: {
          punch_out: 1,
          punch_out_ip: req.body.punchOutIp,
          date_time_obj_out: {
            lt: moment().format('LT'),
            lts: moment().format('LTS'),
            l: moment().format('L'),
            ll: moment().format('LL'),
            lll: moment().format('LLL'),
            llll: moment().format('LLLL'),
            dddd: moment().format('dddd'),
            plain_format: moment().format()
          },
          time_diff: {
            hour_diff: hourDiff,
            min_diff: minDiff,
            diff: `${hourDiff} hour ${minDiff} minutes`
          },
          desc: req.body.desc,
          type: "manual",
          deviceInfoOut: {
            browser: deviceData.browser,
            version: deviceData.version,
            os: deviceData.os,
            platform: deviceData.platform,
            geoIp: deviceData.geoIp,
            source: deviceData.source
          }
        }
      }, {new: true});

      return res.status(200).json({
        msg: 'success',
        code: 200,
        data: trackerFound,
        timeDiff: `${hourDiff} hour ${minDiff} minutes`
      })

      // update tracker
      // trackerFound.punch_out = 1;
      // trackerFound.punch_out_ip = req.body.punchOutIp;
      // trackerFound.date_time_obj_out = {
      //   lt: moment().format('LT'),
      //   lts: moment().format('LTS'),
      //   l: moment().format('L'),
      //   ll: moment().format('LL'),
      //   lll: moment().format('LLL'),
      //   llll: moment().format('LLLL'),
      //   dddd: moment().format('dddd'),
      //   plain_format: moment().format()
      // }
      // trackerFound.time_diff.hour_diff = hourDiff;
      // trackerFound.time_diff.min_diff = minDiff;
      // trackerFound.time_diff.diff = `${hourDiff} hour ${minDiff} minutes`;
      // trackerFound.desc = req.body.desc;
      // trackerFound.type = "manual";
      // trackerFound.deviceInfoOut.browser = deviceData.browser;
      // trackerFound.deviceInfoOut.version = deviceData.version;
      // trackerFound.deviceInfoOut.os = deviceData.os;
      // trackerFound.deviceInfoOut.platform = deviceData.platform;
      // trackerFound.deviceInfoOut.geoIp = deviceData.geoIp;
      // trackerFound.deviceInfoOut.source = deviceData.source;

      // await trackerFound.save((err, result) => {
      //   if (err) {
      //     return res.status(200).json({
      //       msg: 'failure',
      //       code: 400
      //     })
      //   }
      //   return res.status(200).json({
      //     msg: 'success',
      //     code: 200,
      //     data: trackerFound,
      //     timeDiff: `${hourDiff} hour ${minDiff} minutes`
      //   })
      // });
    } else {
      return res.status(200).json({
        msg: 'failure',
        code: 309,
      })
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "punchInNow api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getTrackerByDate = async (req, res, next) => {
  try {
    let newArr = [];
    const currentUser = req.session.user;
    let tracker;
    if (currentUser.role == 1) {
      tracker = await Tracker.find({
        date_punch: {
          $gte: new Date(`${req.body.start.year}-${req.body.start.month}-${req.body.start.date} 00:00:00.000`),
          $lte: new Date(`${req.body.end.year}-${req.body.end.month}-${req.body.end.date} 00:00:00.000`)
        }
      })
      .populate({
        path: 'employee_id',
        select: {
          name: 1
        }
      });

      // <td>8:58 AM (3 hours ago)<br><strong>2405:201:2031:c801:dc35:5011:720c:a3db</strong></td>
      // track.employee_id.name,
      // `<td>${track.employee_id.name}${track.deviceInfoIn && Object.keys(track.deviceInfoIn).length ? `<br><strong>${track.deviceInfoIn.os}/${track.deviceInfoIn.platform}/${track.deviceInfoIn.browser}</strong>` : ""}</td>`

      if (tracker.length) {
        tracker.map(track => {
          // newArr.push([track.employee_id.name, track.date_time_obj.ll, `${track.date_time_obj.lt} (${moment(track.date_time_obj.plain_format).fromNow()})`, `${track.date_time_obj_out ? (track.type == "auto" ? `${track.date_time_obj_out.lt} (auto)` : track.date_time_obj_out.lt) : 'Not yet punched out!'}`, track.time_diff.diff]);
          newArr.push([
            track.employee_id.name,
            track.date_time_obj.ll,
            `<td>${track.date_time_obj.lt} (${moment(track.date_time_obj.plain_format).fromNow()})<br>${track.punch_in_ip ? `<strong>${track.punch_in_ip}</strong>` : ''}</td>`,
            `${track.date_time_obj_out ? (track.type == "auto" ? `${track.date_time_obj_out.lt} (auto)` : track.date_time_obj_out.lt) : 'Not yet punched out!'}`,
            track.time_diff.diff,
            `<td>${track.deviceInfoIn && Object.keys(track.deviceInfoIn).length ? `<br><strong>${track.deviceInfoIn.os}/${track.deviceInfoIn.platform}/${track.deviceInfoIn.browser}</strong>` : "Not Provided"}</td>`,
            `<td>${track.deviceInfoOut && Object.keys(track.deviceInfoOut).length ? `<br><strong>${track.deviceInfoOut.os}/${track.deviceInfoOut.platform}/${track.deviceInfoOut.browser}</strong>` : "Not Provided"}</td>`,
          ]);
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
      tracker = await Tracker.find({
        $and: [{
          employee_id: currentUser._id
        }, {
          date_punch: {
            $gte: new Date(`${req.body.start.year}-${req.body.start.month}-${req.body.start.date} 00:00:00.000`),
            $lte: new Date(`${req.body.end.year}-${req.body.end.month}-${req.body.end.date} 00:00:00.000`)
          }
        }]
      })
      .populate({
        path: 'employee_id',
        select: {
          name: 1
        }
      });

      if (tracker.length) {
        tracker.map(track => {
          newArr.push([track.employee_id.name, track.date_time_obj.ll, `${track.date_time_obj.lt} (${moment(track.date_time_obj.plain_format).fromNow()})`, `${track.date_time_obj_out ? (track.type == "auto" ? `${track.date_time_obj_out.lt} (auto)` : track.date_time_obj_out.lt) : 'Not yet punched out!'}`, track.time_diff.diff]);
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
    console.log(err);
    helper.errorDetailsForControllers(err, "getTrackerByDate api err - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};
