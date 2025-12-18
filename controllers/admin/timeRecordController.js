const mongoose = require('mongoose');
const excel = require('node-excel-export');
const Timesheet = mongoose.model('Timesheet');
const Assign = mongoose.model('Assign');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const _ = require("lodash");
const moment = require('moment-timezone');
const config = require('../../config/');
moment.tz.setDefault(config.timezone);
const helper = require('../../handlers/helper');

exports.testAdminAPI = (req, res, next) => {
  res.send('workng');
};

// const getWholeWeek = () => {
//   let days = [];
//   let currentDate = moment();
//   let weekStart = currentDate.clone().startOf('isoWeek');
//   for (var i = 0; i <= 6; i++) {
//     days.push({date: moment(weekStart).add(i, 'days').format("DD/MM/YYYY"), day: moment(weekStart).add(i, 'days').format("dddd"), year: moment(weekStart).add(i, 'days').year(), month: moment(weekStart).add(i, 'days').month()+1, momDate: moment(weekStart).add(i, 'days').date()});
//   }
//   return days;
// };

// exports.getJQRecordd = async (req, res, next) => { // working
//   try {
//     let newArr = [];

//     if ((req.query.start && req.query.end) && req.query.sSearch_1 && req.query.sSearch_0 && req.query.sSearch) {
//       console.log('ALL');

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch_1 && req.query.sSearch_0) {
//       console.log("date", "emp", "proj");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.sSearch_1 && req.query.sSearch_0 && req.query.sSearch) {
//       console.log("emp", "proj", "search");

//       let countData = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch_0 && req.query.sSearch) {
//       console.log("date", "proj", "search");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch_1 && req.query.sSearch) {
//       console.log("date", "emp", "search");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch_1) {
//       console.log("date", "emp");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             employee_name: req.query.sSearch_1
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch_0) {
//       console.log("date", "proj");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");


//       let countData = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             worked_date: {
//               $gte: new Date(gteDate),
//               $lte: new Date(lteDate)
//             },
//             project_name: req.query.sSearch_0
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if ((req.query.start && req.query.end) && req.query.sSearch) {
//       console.log("date", "search");

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       let countData = [
//         {
//           $and: [{
//             $match: {
//               worked_date: {
//                 $gte: new Date(gteDate),
//                 $lte: new Date(lteDate)
//               }
//             }
//           }, {
//             $match: {
//               notes: {
//                 $regex: req.query.sSearch,
//                 $options: 'i'
//               }
//             }
//           }]
//         }
//       ];

//       let dataPromise = [
//         {
//           $and: [{
//             $match: {
//               worked_date: {
//                 $gte: new Date(gteDate),
//                 $lte: new Date(lteDate)
//               }
//             }
//           }, {
//             $match: {
//               notes: {
//                 $regex: req.query.sSearch,
//                 $options: 'i'
//               }
//             }
//           }]
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       console.log(timesheetsCount);
//       console.log(timesheets);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       console.log(finObj);

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.sSearch_1 && req.query.sSearch_0) {
//       console.log("emp", "proj");

//       let countData = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.sSearch_1 && req.query.sSearch) {
//       console.log("emp", "search");

//       let countData = [
//         {
//           $match: {
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             employee_name: req.query.sSearch_1
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.sSearch_0 && req.query.sSearch) {
//       console.log("proj", "search");

//       let countData = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }
//       ];

//       let dataPromise = [
//         {
//           $match: {
//             project_name: req.query.sSearch_0,
//           }
//         }, {
//           $match: {
//             notes: {
//               $regex: req.query.sSearch,
//               $options: 'i'
//             }
//           }
//         }, {
//           $skip: parseInt(req.query.iDisplayStart)
//         }, {
//           $limit: parseInt(req.query.iDisplayLength)
//         }, {
//           $sort: {worked_date: -1}
//         }
//       ];

//       const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

//       const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, `${timesheet.employee_name ? timesheet.employee_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.start && req.query.end) {
//       console.log('date');

//       const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
//       const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

//       const timesheetsCountPromise = Timesheet.find({
//         worked_date: {
//           $gte: new Date(gteDate),
//           $lte: new Date(lteDate)
//         }
//       })
//       const timesheetsPromise = await Timesheet.find({
//         worked_date: {
//           $gte: new Date(gteDate),
//           $lte: new Date(lteDate)
//         }
//       })
//         .populate({
//           path: 'project_id',
//           select: {
//             name: 1
//           }
//         })
//         .populate({
//           path: 'employee_id',
//           select: {
//             name: 1
//           }
//         })
//         .skip(parseInt(req.query.iDisplayStart))
//         .limit(parseInt(req.query.iDisplayLength))
//         .sort({worked_date: -1})

//       const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//         iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//       };

//       if (timesheets.length) {
//         console.log(timesheets.length)

//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, `${timesheet.employee_id && timesheet.employee_id.name ? timesheet.employee_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     } else if (req.query.sSearch_1) { // employee_search
//       const timesheetsCountPromise = Timesheet.find({
//         employee_name: req.query.sSearch_1
//       })
//       const timesheetsPromise = await Timesheet.find({
//         employee_name: req.query.sSearch_1
//       })
//         .populate({
//           path: 'project_id',
//           select: {
//             name: 1
//           }
//         })
//         .populate({
//           path: 'employee_id',
//           select: {
//             name: 1
//           }
//         })
//         .skip(parseInt(req.query.iDisplayStart))
//         .limit(parseInt(req.query.iDisplayLength))
//         .sort({worked_date: -1})

//         const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//         let finObj = {
//           sEcho: req.query.sEcho,
//           iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//           iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//         };

//         if (timesheets.length) {
//           console.log(timesheets.length)

//           timesheets.map(timesheet => {
//             newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, `${timesheet.employee_id && timesheet.employee_id.name ? timesheet.employee_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//           })
//           finObj.data = newArr;
//           res.json(finObj);
//         } else {
//           finObj.data = newArr;
//           res.json(finObj);
//         }
//     } else if (req.query.sSearch_0) { // project_search
//       const timesheetsCountPromise = Timesheet.find({
//         project_name: req.query.sSearch_0
//       })
//       const timesheetsPromise = await Timesheet.find({
//         project_name: req.query.sSearch_0
//       })
//         .populate({
//           path: 'project_id',
//           select: {
//             name: 1
//           }
//         })
//         .populate({
//           path: 'employee_id',
//           select: {
//             name: 1
//           }
//         })
//         .skip(parseInt(req.query.iDisplayStart))
//         .limit(parseInt(req.query.iDisplayLength))
//         .sort({worked_date: -1})

//         const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//         let finObj = {
//           sEcho: req.query.sEcho,
//           iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//           iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//         };

//         if (timesheets.length) {
//           console.log(timesheets.length)

//           timesheets.map(timesheet => {
//             newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, `${timesheet.employee_id && timesheet.employee_id.name ? timesheet.employee_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//           })
//           finObj.data = newArr;
//           res.json(finObj);
//         } else {
//           finObj.data = newArr;
//           res.json(finObj);
//         }
//     } else if (req.query.sSearch) { // normal_search
//       const timesheetsCountPromise = Timesheet.find({
//         notes: {
//           $regex: req.query.sSearch,
//           $options: 'i'
//         }
//       })
//       const timesheetsPromise = Timesheet.find({
//         notes: {
//           $regex: req.query.sSearch,
//           $options: 'i'
//         }
//       })
//         .populate({
//           path: 'project_id',
//           select: {
//             name: 1
//           }
//         })
//         .populate({
//           path: 'employee_id',
//           select: {
//             name: 1
//           }
//         })
//         .skip(parseInt(req.query.iDisplayStart))
//         .limit(parseInt(req.query.iDisplayLength))
//         .sort({worked_date: -1})

//         const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

//         let finObj = {
//           sEcho: req.query.sEcho,
//           iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
//           iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
//         };

//         if (timesheets.length) {
//           console.log(timesheets.length)

//           timesheets.map(timesheet => {
//             newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, `${timesheet.employee_id && timesheet.employee_id.name ? timesheet.employee_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Edit timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//           })
//           finObj.data = newArr;
//           res.json(finObj);
//         } else {
//           finObj.data = newArr;
//           res.json(finObj);
//         }
//     } else { // none
//       const timesheets = await Timesheet.find({})
//         .populate({
//           path: 'project_id',
//           select: {
//             name: 1
//           }
//         })
//         .populate({
//           path: 'employee_id',
//           select: {
//             name: 1
//           }
//         })
//         .skip(parseInt(req.query.iDisplayStart))
//         .limit(parseInt(req.query.iDisplayLength))
//         .sort({worked_date: -1})

//       let totalDocCount = await Timesheet.countDocuments();
//       let finObj = {
//         sEcho: req.query.sEcho,
//         iTotalRecords: totalDocCount,
//         iTotalDisplayRecords: totalDocCount
//       };

//       if (timesheets.length) {
//         timesheets.map(timesheet => {
//           newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, `${timesheet.employee_id && timesheet.employee_id.name ? timesheet.employee_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `${moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Remove timesheet" data-original-title="Remove timesheet" onclick="deleteTimesheet('${timesheet._id}')"><i class="fa fa-trash"></i></button>`]);
//         })
//         finObj.data = newArr;
//         res.json(finObj);
//       } else {
//         finObj.data = newArr;
//         res.json(finObj);
//       }
//     }

//     return;
//   } catch (err) {
//     helper.errorDetailsForControllers(err, "viewTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
//     next(err);
//     return;
//   }
// };

exports.getJQRecord = async (req, res, next) => { // working
  try {
    let newArr = [];

    let aggregateQue = [
      {
        '$sort': {
          worked_date: -1
        }
      }, {
        '$project': {
          createdAt: 1,
          employee_name: 1,
          notes: 1,
          project_name: 1,
          worked_date: 1,
          'worked_date_obj': 1,
          worked_hour: 1
        }
      }, {
        '$skip': parseInt(req.query.iDisplayStart)
      }, {
        '$limit': parseInt(req.query.iDisplayLength)
      }
    ];

    if (req.query.sSearch_4) {
      let start = moment.tz(`${req.query.sSearch_4}`, "Asia/Kolkata").startOf('day').toDate();
      let end = moment.tz(`${req.query.sSearch_5}`, "Asia/Kolkata").endOf('day').toDate();
      findQue = {
        worked_date: {
          '$gte': start,
          '$lte': end
        }
      }
      aggregateQue.unshift({
        '$match': {
          'worked_date': {
            '$gte': start,
            '$lte': end
          }
        }
      });
    }

    if (req.query.sSearch_0) {
      aggregateQue.unshift({
        '$match': {
          'project_name': req.query.sSearch_0
        }
      });
    }

    if (req.query.sSearch_1) {
      aggregateQue.unshift({
        '$match': {
          'employee_name': req.query.sSearch_1
        }
      });
    }

    if (req.query.sSearch) {
      aggregateQue.unshift({
        '$match': {
          notes: {
            $regex: req.query.sSearch,
            $options: 'i'
          }
        }
      });
    }

    const timesheets = await Timesheet.aggregate(aggregateQue);
    aggregateQue.splice(aggregateQue.length - 2, 2);
    const totalCount = await Timesheet.aggregate(aggregateQue);

    let finObj = {
      sEcho: req.query.sEcho,
      iTotalRecords: totalCount.length,
      iTotalDisplayRecords: totalCount.length
    };

    // console.log(timesheets);

    delete aggregateQue;

    if (timesheets.length) {
      finObj.data = timesheets;
      return res.json(finObj);
    } else {
      finObj.data = newArr;
      return res.json(finObj);
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "viewTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getTestRecord = async (req, res, next) => {
  try {
    console.log(req.query.sSearch);
    const timesheets = await Timesheet.find({
      $or: [{
        project_name: {
          $regex: req.query.sSearch,
          $options: 'i'
        }
      }, {
        employee_name: {
          $regex: req.query.sSearch,
          $options: 'i'
        }
      }]
    })
      .populate({
        path: 'project_id',
        select: {
          name: 1
        }
      })
      .populate({
        path: 'employee_id',
        select: {
          name: 1
        }
      })
      .skip(parseInt(req.query.iDisplayStart))
      .limit(parseInt(req.query.iDisplayLength))
      .sort({worked_date: -1})

    console.log(timesheets.length);

    res.json(timesheets);
  } catch (err) {
    console.log('ERROROROROROROR')
    console.log(err);
    return;
  }
}

exports.viewTimesheet = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;

    if (loggedInUser.role == 1) {
      console.log('inside ADMin');
      const usersPromise = User.find({
        role: 2
      },{
        name: 1
      })
      .sort({
        name: 1
      })
      const projectsPromise = Project.find({}, {
        name: 1
      })
      .sort({
        name: 1
      });

      const [projects, users] = await Promise.all([projectsPromise, usersPromise]);
      res.render('admin/view-admin-timesheet', {
        title: 'Timesheet',
        moment,
        projects,
        users,
      })
    } else {
      const projects = await Assign.find({
        employee_id: loggedInUser._id,
        removed: 0
      })
      .populate({
        path: "project_id",
        select: {
          name: 1
        }
      });
      res.render('admin/view-timesheet', {
        title: 'Timesheet',
        moment,
        projects
      })
    }
  } catch (err) {
    helper.errorDetailsForControllers(err, "viewTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.createTimesheet = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;

    const projects = await Assign.find({
      employee_id: loggedInUser._id,
      removed: 0
    })
    .populate({
      path: "project_id",
      select: {
        name: 1,
        status: 1
      },
      match: {
        status: 'active'
      }
    });

    res.render('admin/add-timesheet', {
      title: 'Add Timesheet',
      projects,
      moment
    })
  } catch (err) {
    helper.errorDetailsForControllers(err, "createTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
}

const findProject = async (projectId) => {
  try {
    const project = await Project.findOne({ _id: projectId });
    return project;
  } catch (err) {
    console.log('ERR IN FINDPROJ');
    console.log(err);
  }
};

const findTimeRecord = async (projectId, workedDate, emp_id) => {
  try {
    const record = await Timesheet.findOne({
      employee_id: emp_id,
      project_id: projectId,
      worked_date: new Date(workedDate)
    });
    return record;
  } catch (err) {
    console.log('ERR IN findTimeRecord');
    console.log(err);
  }
};

exports.postCreateTimesheett = async (req, res, next) => {
  try {
    let duplicateFlag;
    const loggedInUser = req.session.user;
    const projectType = typeof req.body.project_id == 'string' ? [req.body.project_id] : req.body.project_id;

    const dateType = typeof req.body.date == 'string' ? [req.body.date] : req.body.date;

    const hourType = typeof req.body.hour == 'string' ? [req.body.hour] : req.body.hour;

    const notesType = typeof req.body.notes == 'string' ? [req.body.notes] : req.body.notes;

    const mainObject = hourType.map((hourType, i) => ({
      project_id: projectType[i],
      worked_date: dateType[i],
      worked_hour: hourType,
      notes: notesType[i]
    }));

    Promise.all(mainObject.map(async recordWork => {
      let proj = await findProject(recordWork.project_id);
      let timeRecord = await findTimeRecord(recordWork.project_id, recordWork.worked_date, req.session.user._id);
      if (!timeRecord) {
        console.log('Timesheet nahi mila.. proceed');
        let newTimesheet = new Timesheet({
          employee_id: loggedInUser._id,
          project_id: recordWork.project_id,
          worked_date: new Date(`${recordWork.worked_date.split('/')[2]}-${recordWork.worked_date.split('/')[0]}-${recordWork.worked_date.split('/')[1]} 00:00:00.000`),
          worked_date_obj: {
            l: moment(new Date(recordWork.worked_date)).format("DD/MM/YYYY"),
            ll: moment(new Date(recordWork.worked_date)).format('LL'),
            dddd: moment(new Date(recordWork.worked_date)).format('dddd')
          },
          worked_hour: recordWork.worked_hour,
          notes: recordWork.notes,
          project_name: proj.name,
          employee_name: loggedInUser.name,
        })
        await newTimesheet.save();
      } else {
        console.log('Timesheet mila.. stop');
        console.log(timeRecord);
        duplicateFlag = true;
        return;
      }
    }))
      .then(() => {
        req.flash('success', `${duplicateFlag ? "Removed duplicate record & updated timesheet." : "Timesheet Updated!"}`);
        res.redirect('/admin/timesheet/view');
        return;
      })
  } catch (err) {
    helper.errorDetailsForControllers(err, "createTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postCreateTimesheet = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;
    const projectType = typeof req.body.project_id == 'string' ? [req.body.project_id] : req.body.project_id;

    const dateType = typeof req.body.date == 'string' ? [req.body.date] : req.body.date;

    const hourType = typeof req.body.hour == 'string' ? [req.body.hour] : req.body.hour;

    const subTaskType = typeof req.body.sub_task == 'string' ? [req.body.sub_task] : req.body.sub_task;

    const notesType = typeof req.body.notes == 'string' ? [req.body.notes] : req.body.notes;

    const mainObject = hourType.map((hourType, i) => ({
      project_id: projectType[i],
      worked_date: dateType[i],
      worked_hour: hourType,
      notes: (subTaskType[i] && notesType[i]) ? `${subTaskType[i]}(${notesType[i]})` : subTaskType[i] ? subTaskType[i] : notesType[i] ? notesType[i] : "Not Provided"
    }));

    Promise.all(mainObject.map(async recordWork => {
      let proj = await findProject(recordWork.project_id);
      let newTimesheet = new Timesheet({
        employee_id: loggedInUser._id,
        project_id: recordWork.project_id,
        worked_date: new Date(`${recordWork.worked_date.split('/')[2]}-${recordWork.worked_date.split('/')[0]}-${recordWork.worked_date.split('/')[1]} 00:00:00.000`),
        worked_date_obj: {
          l: moment(new Date(recordWork.worked_date)).format("DD/MM/YYYY"),
          ll: moment(new Date(recordWork.worked_date)).format('LL'),
          dddd: moment(new Date(recordWork.worked_date)).format('dddd')
        },
        worked_hour: recordWork.worked_hour,
        notes: recordWork.notes,
        project_name: proj.name,
        employee_name: loggedInUser.name,
      })
      await newTimesheet.save();
    }))
      .then(() => {
        req.flash('success', 'Timesheet updated');
        res.redirect('/admin/timesheet/view');
        return;
      })
  } catch (err) {
    helper.errorDetailsForControllers(err, "createTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.filterTimesheetByDate = async (req, res, next) => {
  try {
    let newArr = [];
    const loggedInUser = req.session.user;
    let timesheets;

    if (loggedInUser.role == 1) {
      timesheets = await Timesheet.find({
        worked_date: {
          $gte: new Date(`${req.body.start.year}-${req.body.start.month}-${req.body.start.date} 00:00:00.000`),
          $lte: new Date(`${req.body.end.year}-${req.body.end.month}-${req.body.end.date} 00:00:00.000`)
        }
      })
        .populate({
          path: 'project_id',
          name: {
            select: 1
          }
        })
        .populate({
          path: 'employee_id',
          name: {
            select: 1
          }
        })

        if (timesheets.length) {
          timesheets.map(timesheet => {
            newArr.push([timesheet.project_id.name, timesheet.employee_id.name, timesheet.worked_date_obj.ll, `${timesheet.worked_hour ? `${timesheet.worked_hour} hour`: 0}`, `${timesheet.notes ? timesheet.notes : "Not Provided"}`, ""]);
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
      timesheets = await Timesheet.find({
        employee_id: loggedInUser._id,
        'worked_date_obj.l': moment(new Date(req.body.start)).format('DD/MM/YYYY')
      })
      .populate({
        path: 'project_id',
        select: {
          name: 1
        }
      });

      if (timesheets.length) {
        timesheets.map(timesheet => {
          newArr.push([timesheet.project_id.name, timesheet.worked_date_obj.ll, `${timesheet.worked_hour ? `${timesheet.worked_hour} hour`: 0}`, `${timesheet.notes ? timesheet.notes : "Not Provided"}`, `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
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
    helper.errorDetailsForControllers(err, "createTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.editTimesheet = async (req, res, next) => {
  try {
    const loggedInUser = req.session.user;
    const timesheet = await Timesheet.findOne({
      _id: req.params.timesheet_id
    })
    console.log(timesheet.worked_hour.toString());
    const projects = await Assign.find({
      employee_id: loggedInUser._id,
      removed: 0
    })
    .populate({
      path: "project_id",
      select: {
        name: 1
      }
    });
    res.render('admin/edit-timesheet',{
      title: 'Edit Timesheet',
      projects,
      moment,
      timesheet
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "editTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postEditTimesheet = async (req, res, next) => {
  try {
    console.log(req.body);
    const project = await Project.findOne({
      _id: req.body.project_id
    }, { name: 1 });
    const updateTimesheet = await Timesheet.findOneAndUpdate(
      { _id: req.params.timesheet_id },
      {
        $set: {
          project_id: req.body.project_id,
          worked_date: req.body.worked_date,
          worked_date_obj: {
            l: moment(new Date(req.body.worked_date)).format("DD/MM/YYYY"),
            ll: moment(req.body.worked_date).format('LL'),
            dddd: moment(req.body.worked_date).format('dddd')
          },
          notes: req.body.notes,
          worked_hour: req.body.worked_hour,
          project_name: project.name
        }
      }
    ).exec((err, result) => {
      if (err) {
        console.log(err);
        req.flash('error', 'Something went wrong');
        res.redirect('back');
        return;
      }
      req.flash('success', 'Updated successfully');
      res.redirect('/admin/timesheet/view');
      return;
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "editTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.getEmpJQRecord = async (req, res, next) => {
  try {
    let newArr = [];
    // console.log(req.query);
    // sSearch_0 == project
    // sSearch == search

    if ((req.query.start && req.query.end) && req.query.sSearch_0 && req.query.sSearch) {
      console.log("date", "proj", "search");

      const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
      const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            },
            project_name: req.query.sSearch_0
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`),
              $lte: new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)
            },
            project_name: req.query.sSearch_0
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if ((req.query.start && req.query.end) && req.query.sSearch_0) {
      console.log("date", "proj");

      const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
      const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            },
            project_name: req.query.sSearch_0
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            },
            project_name: req.query.sSearch_0
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if ((req.query.start && req.query.end) && req.query.sSearch) {
      console.log("date", "search");

      const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
      const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            }
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            }
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if (req.query.sSearch_0 && req.query.sSearch) {
      console.log("proj", "search");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            project_name: req.query.sSearch_0
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            project_name: req.query.sSearch_0
          }
        }, {
          $match: {
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if (req.query.sSearch) {
      console.log("search");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            notes: {
              $regex: req.query.sSearch,
              $options: 'i'
            }
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if (req.query.sSearch_0) {
      console.log("proj");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            project_name: req.query.sSearch_0
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            project_name: req.query.sSearch_0
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)

        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else if ((req.query.start && req.query.end)) {
      console.log("date");

      const gteDate = moment(new Date(`${req.query.start.split("/")[2]}-${req.query.start.split("/")[1]}-${req.query.start.split("/")[0]}`)).subtract(1, 'days').format("YYYY-MM-DD");
      const lteDate = moment(new Date(`${req.query.end.split("/")[2]}-${req.query.end.split("/")[1]}-${req.query.end.split("/")[0]}`)).format("YYYY-MM-DD");

      let countData = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            }
          }
        }
      ];

      let dataPromise = [
        {
          $match: {
            employee_id: mongoose.Types.ObjectId(req.session.user._id),
            worked_date: {
              $gte: new Date(gteDate),
              $lte: new Date(lteDate)
            }
          }
        }, {
          $skip: parseInt(req.query.iDisplayStart)
        }, {
          $limit: parseInt(req.query.iDisplayLength)
        }, {
          $sort: {worked_date: -1}
        }
      ];

      const timesheetsCountPromise = await Timesheet.timesheetFilterForAdminCount(countData);

      const timesheetsPromise = await Timesheet.timesheetFilterForAdmin(dataPromise);

      const [timesheetsCount, timesheets] = await Promise.all([timesheetsCountPromise, timesheetsPromise]);

      let finObj = {
        sEcho: req.query.sEcho,
        iTotalRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length,
        iTotalDisplayRecords: timesheetsCount.length == 0 ? 0 : timesheetsCount.length
      };

      if (timesheets.length) {
        console.log(timesheets.length)
        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_name ? timesheet.project_name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    } else {
      console.log('none');

      const timesheets = await Timesheet.find({
        employee_id: req.session.user._id
      })
        .populate({
          path: 'project_id',
          select: {
            name: 1
          }
        })
        .populate({
          path: 'employee_id',
          select: {
            name: 1
          }
        })
        .skip(parseInt(req.query.iDisplayStart))
        .limit(parseInt(req.query.iDisplayLength))
        .sort({worked_date: -1})

        let totalCountDoc = await Timesheet.countDocuments({ employee_id: req.session.user._id });
        let finObj = {
          sEcho: req.query.sEcho,
          iTotalRecords: totalCountDoc,
          iTotalDisplayRecords: totalCountDoc
        };

      if (timesheets.length) {
        timesheets.map(timesheet => {
          newArr.push([`${timesheet.project_id && timesheet.project_id.name ? timesheet.project_id.name : "Not Provided"}`, timesheet.worked_date_obj.ll, `${timesheet.worked_hour.toString()} hour(s)`, timesheet.notes ? timesheet.notes : "Not Provided", `<button type="button" class="btn btn-link btn-primary" data-toggle="tooltip" title="Edit timesheet" data-original-title="Edit timesheet" onclick="redirectToEditTimesheet('${timesheet._id}')"><i class="fa fa-edit"></i></button>`]);
        })
        finObj.data = newArr;
        res.json(finObj);
      } else {
        finObj.data = newArr;
        res.json(finObj);
      }
    }
    return;
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "editTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.postDeleteRecord = async (req, res, next) => {
  try {
    const record = await Timesheet.findOneAndRemove({
      _id: req.body.timesheet_id
    });
    console.log(record);
    return res.status(200).json({
      message: 'Successfully deleted record!',
      code: 200,
      type: 'success'
    });
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "editTimesheet not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.exportTimesheet = async (req, res, next) => {
  try {
    let currentDateTZ = moment.tz(moment(), "Asia/Kolkata");
    let currentDate = currentDateTZ.clone().tz("Asia/Kolkata");

    let aggregateQue = [
      {
        '$sort': {
          worked_date: -1
        }
      }, {
        '$project': {
          createdAt: 1,
          employee_name: 1,
          notes: 1,
          project_name: 1,
          worked_date: 1,
          'worked_date_obj': 1,
          worked_hour: 1
        }
      }
    ];

    if (req.query.stardate) {
      let start = moment.tz(`${req.query.stardate}`, "Asia/Kolkata").startOf('day').toDate();
      let end = moment.tz(`${req.query.enddate}`, "Asia/Kolkata").endOf('day').toDate();
      findQue = {
        worked_date: {
          '$gte': start,
          '$lte': end
        }
      }
      aggregateQue.unshift({
        '$match': {
          'worked_date': {
            '$gte': start,
            '$lte': end
          }
        }
      });
    }

    if (req.query.project) {
      aggregateQue.unshift({
        '$match': {
          'project_name': req.query.project
        }
      });
    }

    if (req.query.employee) {
      aggregateQue.unshift({
        '$match': {
          'employee_name': req.query.employee
        }
      });
    }

    if (req.query.search_key) {
      aggregateQue.unshift({
        '$match': {
          notes: {
            $regex: req.query.search_key,
            $options: 'i'
          }
        }
      });
    }

    const timesheets = await Timesheet.aggregate(aggregateQue);

    if (timesheets.length > 0) {
      const specification = {
        sr_no: {
          displayName: "Sr No.",
          headerStyle: {},
          width: 50
        },
        projectName: {
          displayName: "Project Name",
          headerStyle: {},
          width: 100
        },
        employeeName: {
          displayName: "Employee Name",
          headerStyle: {},
          width: 100
        },
        workedDate: {
          displayName: "Worked Date",
          headerStyle: {},
          width: 170
        },
        workedHour: {
          displayName: "Worked Hour",
          headerStyle: {},
          width: 120
        },
        notes: {
          displayName: "Notes",
          headerStyle: {},
          width: 120
        },
        submittedOn: {
          displayName: "Submitted On",
          headerStyle: {},
          width: 80
        }
      }

      // all data
      const dataset = [];
      timesheets.map((timesheet, i) => {
        dataset.push({
          sr_no: parseInt(`${i + 1}`),
          projectName: timesheet.project_name || "",
          // subTask : timesheet.subTask || "",
          employeeName: timesheet.employee_name || "",
          workedDate: timesheet.worked_date_obj.ll || "",
          workedHour: timesheet.worked_hour.toString() || "",
          notes: timesheet.notes || "",
          submittedOn: moment(timesheet.createdAt).format("MMM Do YYYY, h:mm a")
        });
      });

      Promise.all(dataset)
        .then(result => {
          const report = excel.buildExport([
            {
              name: 'Report', // <- Specify sheet name (optional)
              merges: [], // <- Merge cell ranges
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]);

          res.attachment(`Timesheet_Export__${currentDate.format("DD-MMM-YYYY hh:mm")}.xlsx`);
          return res.send(report);
        })
    } else {
      req.flash('error', 'No records found');
      res.redirect('back');
      return;
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "exportTimesheet not working - get request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};
