const moment = require('moment');
const { Number } = require('mongoose');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const timesheetSchema = new Schema({
  employee_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  project_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Project'
  },
  worked_date: {
    type: Date
  },
  worked_date_obj: {},
  worked_hour: {
    type: mongoose.Types.Decimal128,
    default: 0
  },
  notes: {
    type: String
  },
  project_name: {
    type: String
  },
  employee_name: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

timesheetSchema.index({
  notes: 'text'
});

timesheetSchema.statics.getReports = function () {
  return this.aggregate([
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1
      }
    }
  ])
};

timesheetSchema.statics.viewDetails = function (employee_id) {
  return this.aggregate([
    {
      $match: {
        employee_id: new mongoose.Types.ObjectId(employee_id)
      }
    },
    {
      $group: {
        _id: '$project_id',
        total_hour: {
          $sum: '$worked_hour'
        }
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'proj'
      }
    },
    {
      $unwind: {
        path: '$proj',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'proj.name': 1
      }
    }
  ])
};

timesheetSchema.statics.getDataByOnlyEmployee = function (employee_id) {
  return this.aggregate([
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $match: {
        _id: new mongoose.Types.ObjectId(employee_id)
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1
      }
    }
  ])
}

timesheetSchema.statics.getDataByOnlyProject = function (project_id) {
  return this.aggregate([
    {
      $match: {
        project_id: new mongoose.Types.ObjectId(project_id)
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1,
        'employee._id': 1
      }
    }
  ])
};

timesheetSchema.statics.getDataByOnlyDate = function (startDate, endDate) {
  const gteDate = moment(new Date(`${startDate.year}-${startDate.month}-${startDate.date}`)).subtract(1, 'days').format("YYYY-MM-DD");

  const lteDate = moment(new Date(`${endDate.year}-${endDate.month}-${endDate.date}`)).format("YYYY-MM-DD");

  return this.aggregate([
    {
      $match: {
        worked_date: {
          $gte: new Date(gteDate),
          $lte: new Date(lteDate)
        }
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1
      }
    }
  ])
}

timesheetSchema.statics.viewDetailsByDate = function (employee_id, startDate, endDate) {
  const gteDate = moment(new Date(`${startDate.year}-${startDate.month}-${startDate.date}`)).subtract(1, 'days').format("YYYY-MM-DD");

  const lteDate = moment(new Date(`${endDate.year}-${endDate.month}-${endDate.date}`)).format("YYYY-MM-DD");

  return this.aggregate([
    {
      $match: {
        employee_id: new mongoose.Types.ObjectId(employee_id),
        worked_date: {
          $gte: new Date(gteDate),
          $lte: new Date(lteDate)
        }
      }
    },
    {
      $group: {
        _id: '$project_id',
        total_hour: {
          $sum: '$worked_hour'
        }
      }
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'proj'
      }
    },
    {
      $unwind: {
        path: '$proj',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'proj.name': 1
      }
    }
  ])
};

timesheetSchema.statics.getDataByProjectAndEmployee = function (project_id, employee_id) {
  return this.aggregate([
    {
      $match: {
        project_id: new mongoose.Types.ObjectId(project_id)
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1,
        'employee._id': 1
      }
    },{
      $match: {
        _id: new mongoose.Types.ObjectId(employee_id)
      }
    }
  ])
}

timesheetSchema.statics.getDataByProjectAndDate = function (project_id, startDate, endDate) {
  const gteDate = moment(new Date(`${startDate.year}-${startDate.month}-${startDate.date}`)).subtract(1, 'days').format("YYYY-MM-DD");

  const lteDate = moment(new Date(`${endDate.year}-${endDate.month}-${endDate.date}`)).format("YYYY-MM-DD");

  return this.aggregate([
    {
      $match:{
        worked_date: {
          $gte: new Date(gteDate),
          $lte: new Date(lteDate)
        },
        project_id: new mongoose.Types.ObjectId(project_id)
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1,
        'employee._id': 1
      }
    }
  ])
}

timesheetSchema.statics.getDataByEmployeeAndDate = function (employee_id, startDate, endDate) {
  const gteDate = moment(new Date(`${startDate.year}-${startDate.month}-${startDate.date}`)).subtract(1, 'days').format("YYYY-MM-DD");

  const lteDate = moment(new Date(`${endDate.year}-${endDate.month}-${endDate.date}`)).format("YYYY-MM-DD");
  return this.aggregate([
    {
      $match:{
        worked_date: {
          $gte: new Date(gteDate),
          $lte: new Date(lteDate)
        },
        employee_id: new mongoose.Types.ObjectId(employee_id)
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1
      }
    }
  ])
};

timesheetSchema.statics.getDataByEmployeeAndDateAndProj = function (employee_id, project_id, startDate, endDate) {
  const gteDate = moment(new Date(`${startDate.year}-${startDate.month}-${startDate.date}`)).subtract(1, 'days').format("YYYY-MM-DD");

  const lteDate = moment(new Date(`${endDate.year}-${endDate.month}-${endDate.date}`)).format("YYYY-MM-DD");
  return this.aggregate([
    {
      $match:{
        worked_date: {
          $gte: new Date(gteDate),
          $lte: new Date(lteDate)
        },
        employee_id: new mongoose.Types.ObjectId(employee_id),
        project_id: new mongoose.Types.ObjectId(project_id)
      }
    },
    {
      $group: {
        _id: '$employee_id',
        total_hour: { $sum: '$worked_hour' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'employee'
      }
    },
    {
      $unwind: {
        path: '$employee',
        includeArrayIndex: 'string',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        total_hour: 1,
        'employee.name': 1,
        'employee._id': 1
      }
    }
  ])
};

timesheetSchema.statics.timesheetFilterForAdminCount = function (dataArr) {
  return this.aggregate(dataArr);
}

timesheetSchema.statics.timesheetFilterForAdmin = function (dataArr) {
  return this.aggregate(dataArr);
}

module.exports = mongoose.model('Timesheet', timesheetSchema);
