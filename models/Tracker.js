const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const trackerSchema = new Schema({
  employee_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  current_date_time: {
    type: Date,
    default: Date.now
  },
  punch_in: {
    type: Number,
    default: 0
  },
  punch_in_time: {
    type: Date,
  },
  punch_out: {
    type: Number,
    default: 0
  },
  punch_out_time: {
    type: Date
  },
  punch_in_ip: {
    type: String
  },
  punch_out_ip: {
    type: String
  },
  date_time_obj: {}, // start time
  date_time_obj_out: {}, // end time
  time_diff: {
    hour_diff: {
      type: String
    },
    min_diff: {
      type: String
    },
    diff: {
      type: String
    }
  },
  date_punch: {
    type: Date
  },
  desc: {
    type: String
  },
  success: {
    type: Boolean,
    default: true
  },
  type: { // auto punch out
    type: String
  },
  deviceInfoIn: {},
  deviceInfoOut: {},
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tracker', trackerSchema);
