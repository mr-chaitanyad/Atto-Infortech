const mongoose = require('mongoose');
const Timesheet = mongoose.model('Timesheet');
const User = mongoose.model('User');
const excel = require("node-excel-export");
const Project = mongoose.model('Project');
const moment = require('moment-timezone');
const config = require('../../config/');
moment.tz.setDefault(config.timezone);
const helper = require('../../handlers/helper');
const { values } = require('lodash');

exports.test = (req, res, next) => {
  return res.json({
    msg: 'hihihih'
  })
};

exports.viewReports = async (req, res, next) => {
  try {
    const employeesPromise = User.find({ role: 2, status: 'active' }).sort({ name: 1  })
    const projectsPromise = Project.find().sort({ name: 1  })
    const reportsPromise = Timesheet.getReports(req.body.employee_id);
    const [employees, reports, projects] = await Promise.all([employeesPromise, reportsPromise, projectsPromise]);

    return res.render('admin/view-report', {
      title: 'View Report',
      reports,
      employees,
      projects
    })
  } catch(err) {
    helper.errorDetailsForControllers(err, "viewReports not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.viewDetails = async (req, res, next) => {
  try {
    const details = await Timesheet.viewDetails(req.body.employee_id);
    return res.status(200).json({
      msg: 'view details',
      code: 200,
      data: details || []
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "viewReports not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.filterDetails = async (req, res, next) => {
  try {
    let datas = [];
    let newArr = [];
    const filterDate = req.query.fromTo;
    const filterEmp = req.query.selEmp;
    const filterProj = req.query.selProj;
    if (filterDate && filterEmp && filterProj) {
      console.log('filterDate && filterEmp && filterProj');
      let dates = JSON.parse(filterDate);
      datas = await Timesheet.getDataByEmployeeAndDateAndProj(filterEmp, filterProj, dates.startDate, dates.endDate);
      if (datas.length) {
        datas.map(data => {
          newArr.push([data ? data.employee.name : "Not Provided", data ? `${data.total_hour} hour(s)` : "Not Provided", `<a href="javascript:void(0);">No details available</a> | <a href="javascript:void(0);" onclick="viewNotesAccordingToDateEmpProj('${dates.startDate.year}', '${dates.startDate.month}', '${dates.startDate.date}', '${dates.endDate.year}', '${dates.endDate.month}', '${dates.endDate.date}', '${data.employee._id}', '${filterProj}', '${data.employee.name}')">View Notes</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else if (filterDate && filterEmp) {
      console.log('filterDate && filterEmp');
      let dates = JSON.parse(filterDate);
      datas = await Timesheet.getDataByEmployeeAndDate(filterEmp, dates.startDate, dates.endDate);
      if (datas.length) {
        datas.map(data => {
          newArr.push([data.employee.name, `${data.total_hour} hour(s)`, `<a href="javascript:void(0);" onclick="viewDetailsAccordingToDate('${data._id}', '${data.employee.name}', '${dates.startDate.year}', '${dates.startDate.month}', '${dates.startDate.date}', '${dates.endDate.year}', '${dates.endDate.month}', '${dates.endDate.date}')">View details</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else if (filterDate && filterProj) {
      console.log('filterDate && filterProj');
      let dates = JSON.parse(filterDate);
      datas = await Timesheet.getDataByProjectAndDate(filterProj, dates.startDate, dates.endDate);
      if (datas.length) {
        datas.map(data => {
          newArr.push([data.employee.name, `${data.total_hour} hour(s)`, `<a href="javascript:void(0);">No details available</a> | <a href="javascript:void(0);" onclick="viewNotesAccordingToDateEmpProj('${dates.startDate.year}', '${dates.startDate.month}', '${dates.startDate.date}', '${dates.endDate.year}', '${dates.endDate.month}', '${dates.endDate.date}', '${data.employee._id}', '${filterProj}', '${data.employee.name}')">View Notes</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else if (filterEmp && filterProj) {
      console.log('filterEmp && filterProj');
      datas = await Timesheet.getDataByProjectAndEmployee(filterProj, filterEmp);
      if (datas.length) {
        datas.map(data => {
          newArr.push([data.employee.name, `${data.total_hour} hour(s)`, `<a href="javascript:void(0);">No details available</a> | <a href="javascript:void(0);" onclick="viewNotes('${data.employee._id}', '${filterProj}', '${data.employee.name}')">View Notes</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }

    } else if (filterDate) {
      console.log('filterDate');
      let dates = JSON.parse(filterDate);
      datas = await Timesheet.getDataByOnlyDate(dates.startDate, dates.endDate);
      if (datas.length) {
        datas.map(data => {
          newArr.push([data.employee.name, `${data.total_hour} hour(s)`, `<a href="javascript:void(0);" onclick="viewDetailsAccordingToDate('${data._id}', '${data.employee.name}', '${dates.startDate.year}', '${dates.startDate.month}', '${dates.startDate.date}', '${dates.endDate.year}', '${dates.endDate.month}', '${dates.endDate.date}')">View details</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else if (filterEmp) {
      console.log('filterEmp');
      datas = await Timesheet.getDataByOnlyEmployee(filterEmp);
      if (datas.length) {
        datas.map(data => {
          newArr.push([(data && data.employee) ? data.employee.name : "Not Provided", data ? `${data.total_hour} hour(s)` : "Not Provided", `<a href="javascript:void(0);" onclick="viewDetails('${data._id}', '${data.employee.name}')">View details</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else if (filterProj) {
      console.log('filterProj');
      datas = await Timesheet.getDataByOnlyProject(filterProj);
      if (datas.length) {
        datas.map(data => {
          newArr.push([(data && data.employee) ? data.employee.name : "Not Provided", data ? `${data.total_hour} hour(s)` : "Not Provided", `<a href="javascript:void(0);">No details available</a> | <a href="javascript:void(0);" onclick="viewNotes('${data.employee._id}', '${filterProj}', '${data.employee.name}')">View Notes</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    } else {
      console.log('None');
      datas = await Timesheet.getReports(filterEmp);
      if (datas.length) {
        datas.map(data => {
          newArr.push([(data && data.employee) ? data.employee.name : "Not Provided", data ? `${data.total_hour} hour(s)` : "Not Provided", `<a href="javascript:void(0);" onclick="viewDetails('${data._id}', '${data.employee ? data.employee.name : "Not Provided"}')">View details</a>`]);
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
          msg: 'working',
          code: 200,
          data: {
            newArr
          }
        })
      }
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "filterDetails not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.viewDetailsByDate = async (req, res, next) => {
  try {
    const details = await Timesheet.viewDetailsByDate(req.body.employee_id, req.body.start, req.body.end);
    return res.status(200).json({
      msg: 'view details',
      code: 200,
      data: details || []
    })
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "viewDetailsByDate not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};

exports.viewEmployeeNotes = async (req, res, next) => {
  try {
    const filterDate = req.query.fromStartYear;
    const filterEmp = req.query.emp_id;
    const filterProj = req.query.proj_id;

    if (filterDate && filterEmp && filterProj) {
      const notes = await Timesheet.find({
        worked_date: {
          $gte: new Date(`${req.query.fromStartYear}-${req.query.fromStartMonth}-${req.query.fromStartDate}`),
          $lte: new Date(`${req.query.toEndYear}-${req.query.toEndMonth}-${req.query.toEndDate}`)
        },
        employee_id: filterEmp,
        project_id: filterProj
      }, {
        project_name: 1,
        notes:1,
        employee_name: 1,
        employee_id: 1,
        project_id:1,
        worked_date_obj: 1,
        worked_hour: 1
      })
        .sort({worked_date: -1});

      return res.status(200).json({
        message: 'view employee notes',
        data: notes || [],
        code: 200
      })
    } else if (filterDate && filterProj) {
      const notes = await Timesheet.find({
        worked_date: {
          $gte: new Date(`${req.query.fromStartYear}-${req.query.fromStartMonth}-${req.query.fromStartDate}`),
          $lte: new Date(`${req.query.toEndYear}-${req.query.toEndMonth}-${req.query.toEndDate}`)
        },
        employee_id: filterEmp,
        project_id: filterProj
      }, {
        project_name: 1,
        notes:1,
        employee_name: 1,
        employee_id: 1,
        project_id:1,
        worked_date_obj: 1,
        worked_hour: 1
      })
        .sort({worked_date: -1});

      return res.status(200).json({
        message: 'view employee notes',
        data: notes || [],
        code: 200
      })
    } else {
      const notes = await Timesheet.find({
        employee_id: req.body.employee_id,
        project_id: req.body.project_id
      }, {
        project_name: 1,
        notes:1,
        employee_name: 1,
        employee_id: 1,
        project_id:1,
        worked_date_obj: 1,
        worked_hour: 1
      })
        .sort({worked_date: -1});

      return res.status(200).json({
        message: 'view employee notes',
        data: notes || [],
        code: 200
      })
    }
  } catch (err) {
    console.log(err);
    helper.errorDetailsForControllers(err, "viewEmployeeNotes not working - post request", req.originalUrl, req.body, {}, "redirect", __filename);
    next(err);
    return;
  }
};



// new fuction for export to excel (15/12/2025)
// exports.exportToExcel = async (req, res, next) => {
//   try {
//     console.log("Inside exportToExcel controller");

//     //  Fetch all timesheet records
//     const records = await Timesheet.find({})
//       .populate("employee_id", "name email")
//       .lean();

//     if (!records.length) {
//       return res.status(404).send("No timesheet data found");
//     }

//     //  Group data by employee
//     const employeeMap = {};

//     records.forEach(item => {
//       const empId = item.employee_id?._id?.toString();
//       const empName = item.employee_name || item.employee_id?.name || "Unknown";

//       if (!employeeMap[empId]) {
//         employeeMap[empId] = {
//           employeeName: empName,
//           data: []
//         };
//       }

//       employeeMap[empId].data.push(item);
//     });

//     //  Excel styles
//     const styles = {
//       header: {
//         font: { bold: true },
//         fill: { fgColor: { rgb: "FFD9D9D9" } }
//       }
//     };

//     //  Column specification
//     const specification = {
//       srNo: {
//         displayName: "Sr No",
//         headerStyle: styles.header,
//         width: 60
//       },
//       worked_date: {
//         displayName: "Worked Date",
//         headerStyle: styles.header,
//         width: 120
//       },
//       project_name: {
//         displayName: "Project Name",
//         headerStyle: styles.header,
//         width: 200
//       },
//       worked_hour: {
//         displayName: "Worked Hours",
//         headerStyle: styles.header,
//         width: 120
//       },
//       notes: {
//         displayName: "Notes",
//         headerStyle: styles.header,
//         width: 300
//       }
//     };

//     //  Build multiple sheets
//     const sheets = [];

//     Object.values(employeeMap).forEach(emp => {
//       const dataset = emp.data.map((row, index) => ({
//         srNo: index + 1,
//         worked_date: row.worked_date
//           ? new Date(row.worked_date).toLocaleDateString()
//           : "-",
//         project_name: row.project_name || "-",
//         worked_hour: row.worked_hour?.toString() || "0",
//         notes: row.notes || "-"
//       }));

//       sheets.push({
//         name: emp.employeeName.substring(0, 31), // Excel sheet name limit
//         specification,
//         data: dataset
//       });
//     });

//     //  Generate Excel
//     const excelFile = excel.buildExport(sheets);

//     //  Send response
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=Employee_Timesheet_Report.xlsx"
//     );

//     return res.send(excelFile);

//   } catch (err) {
//     console.error("Excel export error:", err);
//     next(err);
//   }
// };

exports.exportToExcel = async (req, res, next) => {
  try {
    console.log("Inside exportToExcel controller");

    const { fromTo, selEmp, selProj } = req.query;

    let query = {};

    //  Date filter
    if (fromTo) {
      const dates = JSON.parse(fromTo);
      query.worked_date = {
        $gte: new Date(dates.startDate),
        $lte: new Date(dates.endDate)
      };
    }

    //  Employee filter
    if (selEmp) {
      query.employee_id = selEmp;
    }

    //  Project filter
    if (selProj) {
      query.project_id = selProj;
    }

    console.log("Excel Filter Query:", query);

    // 🔍 Fetch FILTERED records
    const records = await Timesheet.find(query)
      .populate("employee_id", "name")
      .lean();

    if (!records.length) {
      return res.status(404).send("No filtered data found");
    }

    // ================= GROUP BY EMPLOYEE =================
    const employeeMap = {};

    records.forEach(item => {
      if (!item.employee_id || !item.employee_id.name) return;

      const empId = item.employee_id._id.toString();
      const empName = item.employee_id.name.trim();

      if (!employeeMap[empId]) {
        employeeMap[empId] = {
          employeeName: empName,
          data: []
        };
      }

      employeeMap[empId].data.push(item);
    });

    // ================= EXCEL CONFIG =================
    const styles = {
      header: {
        font: { bold: true },
        fill: { fgColor: { rgb: "FFD9D9D9" } }
      },
      totalRow: {
        font: { bold: true },
        fill: { fgColor: { rgb: "FFFFE699" } } // light yellow
      }

    };

    const specification = {
      // srNo: { displayName: "Sr No", headerStyle: styles.header, width: 60 },
      // worked_date: { displayName: "Worked Date", headerStyle: styles.header, width: 120 },
      project_name: { displayName: "Project Name", headerStyle: styles.header, width: 200 },
      worked_hour: { displayName: "Worked Hours", headerStyle: styles.header, width: 120 },
      // notes: { displayName: "Notes", headerStyle: styles.header, width: 300 }
    };

    const sheets = [];

    Object.values(employeeMap).forEach(emp => {
        let totalWorkedHours = 0; //  accumulator
      const dataset = emp.data.map((row, index) => {

        // srNo: index + 1,
        // worked_date: row.worked_date
        //   ? new Date(row.worked_date).toLocaleDateString()
        //   : "-",
        // project_name: row.project_name || "-",
        // worked_hour: Number(row.worked_hour) || 0, // INT
        
        // worked_hour: row.worked_hour?.toString() || "0",
        // notes: row.notes || "-"

          const hours = Number(row.worked_hour) || 0;
          totalWorkedHours += hours; // 👈 sum

          return {
            project_name: row.project_name || "-",
            worked_hour: hours
          }
      });
      dataset.push({
        project_name: {
          value : "Total Worked Hours",
          style : styles.totalRow
        },
        worked_hour: {
          value : totalWorkedHours,
          style : styles.totalRow
        }
      });

      sheets.push({
        name: emp.employeeName.replace(/[:\\/?*\[\]]/g, "").substring(0, 31),
        specification,
        data: dataset
      });
    });

    if (!sheets.length) {
      return res.status(400).send("No valid filtered data to export");
    }

    const excelFile = excel.buildExport(sheets);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Filtered_Timesheet_Report.xlsx"
    );

    return res.send(excelFile);

  } catch (err) {
    console.error("Excel Export Error:", err);
    next(err);
  }
};
